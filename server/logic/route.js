import moment from 'moment'
import 'moment-timezone'

import Route from '../models/route'
import locationLogic from '../logic/location'
import { sloveneToEnglish } from '../logic/translate'
import { formatError } from '../utils/error-utils'

async function all(data) {
    try {
        if (!data) {
            data = { }
        } else if (Array.isArray(data)) {
            data = { '_id': { $in: data } }
        }
        const routes = await Route.find(data, '-__v')
        return routes
    } catch (error) {
        throw formatError(500, error)
    }
}

async function get(id) {
    try {
        const route = await Route.findById(id, '-__v')
        return route
    } catch (error) {
        throw formatError(500, error)
    }
}

async function create(data) {
    try {
        const route = new Route(data)
        await route.save()
        return route
    } catch (error) {
        throw formatError(500, error)
    }
}

async function update(id, data) {
    try {
        await Route.findOneAndUpdate({ _id: id }, { $set: data }, {})
    } catch (error) {
        throw formatError(500, error)
    }
}

async function remove(id) {
    try {
        await Route.remove({ _id: id })
    } catch (error) {
        throw formatError(500, error)
    }
}

const BUILDING_TYPES = {
    'church': 'BUILDING_TYPE_CHURCH',
    'museum': 'BUILDING_TYPE_MUSEUM',
    'regional': 'BUILDING_TYPE_REGIONAL',
    'archeological': 'BUILDING_TYPE_ARCHEOLOGICAL',
    'historical': 'BUILDING_TYPE_HISTORICAL'
}

// Map the location type to something we can recognize and work with easily
const BUILDING_TYPE_MAPPING = {
    'museum': 'museum',
    'vrtnoarhitekturna dediščina': 'regional',
    'kulturna krajina': 'regional',
    'naselbinska dediščina': 'regional',
    'memorialna dediščina': 'historical',
    'arheološka dediščina': 'archeological',
    'profana stavbna dediščina': 'regional',
    'sakralna stavbna dediščina': 'church'
}
function invertObject(obj) {
    const newObj = {}
    for (let key in obj) {
        newObj[obj[key]] = key
    }
    return newObj
}
const INVERSE_BUILDING_TYPE_MAPPING = invertObject(BUILDING_TYPE_MAPPING) // eslint-disable-line no-unused-vars

// How much time will we give to each visiting location type (in minutes)
const BUILDING_TYPE_VISIT_DURATION = {
    'museum': 90,
    'regional': 45,
    'historical': 45,
    'archeological': 30,
    'church': 30
}

function normalizeBuildingTypes(buildings, ignoreUnrecognized = true) {
    const types = []
    buildings.forEach((val) => {
        if (val in BUILDING_TYPE_MAPPING) {
            types.push(BUILDING_TYPE_MAPPING[val])
        } else if (val in BUILDING_TYPES) {
            types.push(val)
        } else {
            if (!ignoreUnrecognized) {
                throw new Error('Unrecognized type: ' + val)
            }
        }
    })
    return types
}

const TRAVEL_METHODS = {
    'car': 'TRAVEL_METHOD_CAR',
    'public_transport': 'TRAVEL_METHOD_PUBLIC_TRANSPORT',
    'bicycle': 'TRAVEL_METHOD_BICYCLE',
    'foot': 'TRAVEL_METHOD_FOOT'
}

// What is the maximum km that we will consider for each mode of transportation
const TRAVEL_METHOD_DISTANCE_LIMIT = {
    'TRAVEL_METHOD_CAR': 15,
    'TRAVEL_METHOD_PUBLIC_TRANSPORT': 15,
    'TRAVEL_METHOD_BICYCLE': 5,
    'TRAVEL_METHOD_FOOT': 1
}

const DAY_DURATION = (() => {
    const times = [9, 13, 18].map((t) =>
        moment().tz('Europe/Ljubljana').hour(t).minute(0).second(0))

    return {
        'day': [times[0].clone(), times[2].clone()],
        'morning': [times[0].clone(), times[1].clone()],
        'evening': [times[1].clone(), times[2].clone()]
    }
})()

// Extract lat/long from the database since we'll be using this frequently to
// compute distances
function extractCoordinates(locations) {
    return locations.map(location => [location['latitude'], location['longitude']])
}

const toRadians = (angle) => angle * Math.PI / 180
const range = (n) => Array(n + 1).fill().map((_, idx) => idx)
const randInt = (max) => Math.floor(Math.random() * Math.floor(max)) // eslint-disable-line no-unused-vars

// Helper functions for probability densities
const dnorm = (x, mu = 0, std = 1) =>
    Math.exp(-Math.pow(x - mu, 2) / (2 * std * std)) / (Math.sqrt(2 * Math.PI) * std)
const dnormArr = (arr, mu = 0, std = 1) => arr.map(x => dnorm(x, mu, std))
const sum = (arr) => arr.reduce((a, b) => a + b, 0)
const normalize = (arr) => {
    const normalizer = sum(arr)
    return arr.map((el) => el / normalizer)
}
// Choose a random element from `arr` with given probabilities for each element
const weightedRand = (arr, probabilities) => {
    let sum = 0
    const r = Math.random()
    for (let i = 0; i < arr.length; i++) {
        sum = sum + probabilities[i]
        if (r <= sum) {
            return arr[i]
        }
    }
    // In case of rounding errors, probabilities may not sum to 1, so we return
    // last element in the rare event that r=1
    return arr[arr.length - 1]
}

const ones = (n) => Array(n).fill().map(() => 1)

// Compute the great circle distance between a seed location and a list of
// location coords. I suppose that since Slovenia is small and the curvature is
// locally linear, using euclidean would be fine in most cases as well, but
// let's be precise
function haversineDistance(seedCoords, coords) {
    return coords.map(location => {
        const lat1 = toRadians(seedCoords[0])
        const long1 = toRadians(seedCoords[1])
        const lat2 = toRadians(location[0])
        const long2 = toRadians(location[1])

        const dlong = long2 - long1
        const dlat = lat2 - lat1

        const a = Math.pow(Math.sin(dlat / 2), 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlong / 2), 2)

        const c = 2 * Math.asin(Math.sqrt(a))
        const km = 6367 * c

        return km
    })
}

// Get the duration of time needed to reach the end from the start
function getTravelTimeBetween(start, end, method) {
    // TODO: Replace this with API call to google distance matrix to get actual travel time
    const distance = haversineDistance(start, [end])[0]
    const speed = { 'car': 40, 'bicycle': 10, 'foot': 3, 'public': 30 }[method]
    return speed / distance
}

async function generateRoute(params) {
    // Load up data
    const data = await locationLogic.all()

    const travelMethod = TRAVEL_METHODS[params.travelMethod]

    // 95% of all data falls within 2 standard deviations in a normal distribution
    const stddev = TRAVEL_METHOD_DISTANCE_LIMIT[travelMethod] / 2

    const locationIndices = range(data.length)

    let currentCoords = params.seedCoords
    const route = []

    // Keep track of what time of the day it currently is
    const duration = DAY_DURATION[params.travelDuration]
    let startTime = duration[0]
    let endTime = duration[1]
    let currentTime = startTime.clone()

    // We'll keep track of preference probabilities so that the same type
    // doesn't repeat too many times
    let preferenceProbabilities = ones(params.preferences.length)
    preferenceProbabilities = normalize(preferenceProbabilities)

    let distances, probabilities, idx, location, previousCoords
    const locationCoords = extractCoordinates(data)

    // Leave 30 minutes of lee-way between so we can get home comfortably
    while (currentTime.isBefore(endTime.clone().subtract(30, 'minutes'))) {
        // Compute distances from the current location to all the locations in the database
        distances = haversineDistance(currentCoords, locationCoords)

        probabilities = dnormArr(distances, 0, stddev)

        // Zero out any of the locations that were not in the users preferences
        for (let i = 0; i < data.length; i++) {
            if (!params.preferences.includes(BUILDING_TYPE_MAPPING[data[i].type])) {
                probabilities[i] = 0
            }
        }

        // Use running preference probabilities so the same type of building is
        // not repeated too many times
        for (let i = 0; i < data.length; i++) {
            let idx = params.preferences.findIndex(el => el === BUILDING_TYPE_MAPPING[data[i].type])
            if (idx >= 0) { // Is -1 if the type of building is not in preferences
                probabilities[i] *= preferenceProbabilities[idx]
            }
        }

        // Zero out already visited locations so the same place is not recommended twice
        route.forEach(node => {
            probabilities[node.idx] = 0
        })
        probabilities = normalize(probabilities)

        // Select a random location according to the probabilities
        idx = weightedRand(locationIndices, probabilities)

        location = data[idx]

        // Translate slovene descriptions to english so we can generate audio files using Watson
        if (location.description && !location.descriptionEn) {
            const descriptionEn = await sloveneToEnglish(location.description)
            await locationLogic.update(location.id, { descriptionEn })
            location['descriptionEn'] = descriptionEn
        }

        const routeNode = { idx, location, distance: distances[idx] }
        previousCoords = currentCoords
        currentCoords = [location.latitude, location.longitude]

        // Update preference probabilities
        const typeIdx = params.preferences.findIndex(el => el === BUILDING_TYPE_MAPPING[location.type])
        preferenceProbabilities[typeIdx] = Math.max(0, preferenceProbabilities[typeIdx] - 0.2)
        preferenceProbabilities = normalize(preferenceProbabilities)

        // How long will it take to get from where we are now to where we want to go?
        const driveTime = getTravelTimeBetween(previousCoords, currentCoords, params.travelMethod)
        routeNode['travelStartTime'] = currentTime.clone()
        routeNode['travelDuration'] = driveTime
        currentTime = currentTime.add(driveTime, 'minutes')

        // How long will we stay there?
        const visitDuration = BUILDING_TYPE_VISIT_DURATION[BUILDING_TYPE_MAPPING[location.type]]
        routeNode['visitStartTime'] = currentTime.clone()
        currentTime = currentTime.add(visitDuration, 'minutes')
        routeNode['visitEndTime'] = currentTime.clone()
        routeNode['visitDuration'] = visitDuration

        route.push(routeNode)
    }

    return route
}

module.exports = {
    all, get, create, update, remove, BUILDING_TYPES, normalizeBuildingTypes, generateRoute
}
