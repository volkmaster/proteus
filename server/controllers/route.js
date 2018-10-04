import express from 'express'

import routeLogic from '../logic/route'
import userLogic from '../logic/user'
import { verifyToken } from '../middleware/middleware'
import { copyObject } from '../utils/helper-utils'
import { sendError } from '../utils/error-utils'

const router = express.Router()
router.use(verifyToken)

router.post('/', async (req, res, next) => {
    const data = req.body
    let route

    try {
        // Get user's past routes
        const user = await userLogic.get(req.decoded.id)
        const pastRoutes = (await routeLogic.all(user.routes)).map(route => route.nodes)

        const params = {
            // Default to coordinates in the middle of Ljubljana
            seedCoords: [
                data.latitude || 46.050185,
                data.longitude || 14.503785
            ],

            // How will our weary traveller move around the country and how long of
            // a trip do they want
            travelMethod: data.travelMethod || 'car',
            travelDuration: data.travelDuration || 'day',

            // Properly parse preferences string given in comma-separated format:
            // ...&preferences=church,museum,regional
            preferences: (value => {
                return value ? routeLogic.normalizeBuildingTypes(value) : Object.keys(routeLogic.BUILDING_TYPES)
            })(data.preferences)
        }

        // Generate a route with the given parameters
        const nodes = await routeLogic.generateRoute(params)

        // Save the route
        route = await routeLogic.create({ nodes })
        user.routes.push(route)
        user.save()
    } catch (error) {
        sendError(res, error)
    }

    res.status(201).json(route)
})

export default router
