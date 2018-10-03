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
    'TRAVEL_METHOD_CAR': 50,
    'TRAVEL_METHOD_PUBLIC_TRANSPORT': 50,
    'TRAVEL_METHOD_BICYCLE': 10,
    'TRAVEL_METHOD_FOOT': 5
}


const DAY_DURATION = (() => {
    const times = [9, 13, 18].map((t) =>
        moment().tz('Europe/Ljubljana').hour(t).minute(0).second(0))

    return {
        'full': [times[0].clone(), times[2].clone()],
        'morning': [times[0].clone(), times[1].clone()],
        'evening': [times[1].clone(), times[2].clone()]
    }
})()

function generateRoute(params) {
    return {}
}

module.exports = {
    BUILDING_TYPES, normalizeBuildingTypes, generateRoute
}
