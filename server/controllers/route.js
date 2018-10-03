import express from 'express'
const router = express.Router()

import routeLogic from '../logic/route'

router.get('', (req, res, next) => {
    const params = {
        // Default to coordinates in the middle of Ljubljana
        seedLat: req.query.lat || 46.050185,
        seedLong: req.query.long || 14.503785,

        // How will our weary traveller move around the country and how long of
        // a trip do they want
        travelMethod: req.query.travel_method || 'car',
        travelDuration: req.query.travel_method || 'day',

        // Properly parse preferences string given in comma-separated format:
        // ...&preferences=church,museum,regional
        preferences: ((string) => {
            return string == null ? Object.keys(routeLogic.BUILDING_TYPES) :
                routeLogic.normalizeBuildingTypes(string.split(','))
        })(req.query.preferences)
    }

    // Generate a route with the given parameters
    const route = routeLogic.generateRoute(params)

    res.json(route)
})

export default router
