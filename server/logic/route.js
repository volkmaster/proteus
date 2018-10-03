const moment = require('moment')
require('moment-timezone')


const BUILDING_TYPES = {
    'church': 'BUILDING_TYPE_CHURCH',
    'museum': 'BUILDING_TYPE_MUSEUM',
    'regional': 'BUILDING_TYPE_REGIONAL',
    'archeological': 'BUILDING_TYPE_ARCHEOLOGICAL',
    'historical': 'BUILDING_TYPE_HISTORICAL',
}

// Map the entry type to something we can recognize and work with easily
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
    let newObj = {}
    for (let key in obj) newObj[obj[key]] = key
    return newObj
}
const INVERSE_BUILDING_TYPE_MAPPING = invertObject(BUILDING_TYPE_MAPPING)

// How much time will we give to each visiting location type (in minutes)
const BUILDING_TYPE_VISIT_DURATION = {
    'museum': 90,
    'regional': 45,
    'historical': 45,
    'archeological': 30,
    'church': 30
}

function normalizeBuildingTypes(buildings, ignoreUnrecognized = true) {
    let types = []
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

// Load up data once, so it'll be avabilable for all requests
const data = require('../data/full.json')

// Extract lat/long from the database since we'll be using this frequently to
// compute distances
function extractCoordinates(locations) {
    return locations.map((entry) => [entry['latitude'], entry['longitude']])
}
const locationCoords = extractCoordinates(data);

const toRadians = (angle) => angle * Math.PI / 180
const range = (n) => Array(n + 1).fill().map((_, idx) => idx)
const randInt = (max) => Math.floor(Math.random() * Math.floor(max))

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
    let sum = 0, r = Math.random()
    for (let i = 0; i < arr.length; i++) {
        sum = sum + probabilities[i]
        if (r <= sum) return arr[i]
    }
    // In case of rounding errors, probabilities may not sum to 1, so we return
    // last element in the rare event that r=1
    return arr[arr.length - 1]
}

const ones = (n) => Array(n).fill().map((_) => 1)

// Compute the great circle distance between a seed location and a list of
// location coords. I suppose that since Slovenia is small and the curvature is
// locally linear, using euclidean would be fine in most cases as well, but
// let's be precise
function haversineDistance(seedCoords, coords = locationCoords) {
    return coords.map((entry) => {
        const lat1 = toRadians(seedCoords[0]); const long1 = toRadians(seedCoords[1])
        const lat2 = toRadians(entry[0]); const long2 = toRadians(entry[1])

        const dlong = long2 - long1; const dlat = lat2 - lat1

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
    const distance = haversineDistance(start, [end])[0];
    const speed = {'car': 40, 'bicycle': 10, 'foot': 3, 'public': 30}[method]
    return speed / distance
}


function generateRoute(params) {
    const travelMethod = TRAVEL_METHODS[params.travelMethod]

    // 95% of all data falls within 2 standard deviations in a normal distribution
    const stddev = TRAVEL_METHOD_DISTANCE_LIMIT[travelMethod] / 2
    
    const locationIndices = range(data.length)

    let currentCoords = params.seedCoords
    let route = []

    // Keep track of what time of the day it currently is
    let startTime = DAY_DURATION[params.travelDuration][0]
    let endTime = DAY_DURATION[params.travelDuration][1]
    let currentTime = startTime

    // We'll keep track of preference probabilities so that the same type
    // doesn't repeat too many times
    let preferenceProbabilities = ones(params.preferences.length)
    preferenceProbabilities = normalize(preferenceProbabilities)
    
    let distances, probabilities, idx, entry, previousCoords
    for (let j = 0; j < 5; j++) {
        // Compute distances from the current location to all the locations in the database
        distances = haversineDistance(currentCoords, locationCoords)
        
        probabilities = dnormArr(distances, 0, stddev)

        // Zero out any of the locations that were not in the users preferences
        for (let i = 0; i < data.length; i++) {
            if (!params.preferences.includes(BUILDING_TYPE_MAPPING[data[i].type]))
                probabilities[i] = 0 
        }
        
        // Use running preference probabilities so the same type of building is
        // not repeated too many times
        for (let i = 0; i < data.length; i++) {
            let idx = params.preferences.findIndex((el) => el == BUILDING_TYPE_MAPPING[data[i].type])
            if (idx >= 0) { // Is -1 if the type of building is not in preferences
                probabilities[i] *= preferenceProbabilities[idx]
            }
        }

        // Zero out already visited locations so the same place is not recommended twice
        route.forEach(entry => { probabilities[entry.idx] = 0 })
        probabilities = normalize(probabilities)
        
        // Select a random location according to the probabilities
        idx = weightedRand(locationIndices, probabilities)
        
        entry = data[idx]
        let routeNode = { idx, entry, distance: distances[idx] }
        previousCoords = currentCoords
        currentCoords = [entry.latitude, entry.longitude]

        // Update preference probabilities
        let typeIdx = params.preferences.findIndex((el) => el == BUILDING_TYPE_MAPPING[entry.type])
        preferenceProbabilities[typeIdx] = Math.max(0, preferenceProbabilities[typeIdx] - 0.2)
        preferenceProbabilities = normalize(preferenceProbabilities)
        
        // How long will it take to get from where we are now to where we want to go?
        const driveTime = getTravelTimeBetween(previousCoords, currentCoords, params.travelMethod)
        routeNode['travelStartTime'] = currentTime
        routeNode['travelDuration'] = driveTime
        currentTime = currentTime.add(driveTime, 'minutes')
        // How long will we stay there?
        const visitDuration = BUILDING_TYPE_VISIT_DURATION[BUILDING_TYPE_MAPPING[entry.type]]
        routeNode['visitStartTime'] = currentTime
        currentTime = currentTime.add(visitDuration, 'minutes')
        routeNode['visitEndTime'] = currentTime
        routeNode['visitDuration'] = visitDuration

        route.push(routeNode)
    }
    console.log(route);
    

    return route
}

module.exports = {
    BUILDING_TYPES, normalizeBuildingTypes, generateRoute
}
