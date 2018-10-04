import express from 'express'

import routeLogic from '../logic/route'
import userLogic from '../logic/user'
import * as translate from '../logic/translate'
import { verifyToken } from '../middleware/middleware'
import { sendError } from '../utils/error-utils'

const router = express.Router()
router.use(verifyToken)

router.post('/', async (req, res, next) => {
    const data = req.body

    // Get user's past routes
    try {
        const user = await userLogic.get(req.decoded.id)
        const routes = (await routeLogic.all(user.routes)).map(route => route.route)
    } catch (error) {
        sendError(res, error)
    }

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
    const route = routeLogic.generateRoute(params)

    // Translate slovene descriptions to english so we can generate audio files using watson
    const descriptions = route.map(node => node.entry.description)
    const translatedDescriptions = await translate.sloveneToEnglish(descriptions)
    translatedDescriptions.forEach((val, idx) => {
        route[idx].entry['descriptionEn'] = val
    })

    // Save the route
    let _route
    try {
        _route = await routeLogic.create({ route })
        const user = await userLogic.get(req.decoded.id)
        user.routes.push(_route)
        user.save()
    } catch (error) {
        sendError(res, error)
    }

    res.status(201).json(_route)
})

export default router
