import express from 'express'

import locationLogic from '../logic/location'
import { verifyToken, verifyAdmin } from '../middleware/middleware'
import { sendError } from '../utils/error-utils'

const router = express.Router()
router.use(verifyToken)

router.get('/', async (req, res, next) => {
    try {
        const locations = await locationLogic.all()
        res.status(200).send(locations)
    } catch (error) {
        sendError(res, error)
    }
})

router.get('/:id', async (req, res, next) => {
    const locationId = req.params.id
    if (!locationId) {
        res.status(400).send('Location ID is required.')
    }

    try {
        const location = await locationLogic.get(locationId)
        res.status(200).json(location)
    } catch (error) {
        sendError(res, error)
    }
})

router.post('/', verifyAdmin, async (req, res, next) => {
    const data = req.body

    try {
        const location = await locationLogic.create(data)
        res.status(201).send(location._id)
    } catch (error) {
        sendError(res, error)
    }
})

router.patch('/:id', verifyAdmin, async (req, res, next) => {
    const locationId = req.params.id
    if (!locationId) {
        res.status(400).send('Location ID is required.')
    }

    const data = req.body

    try {
        await locationLogic.update(locationId, data)
        res.sendStatus(204)
    } catch (error) {
        sendError(res, error)
    }
})

router.delete('/:id', verifyAdmin, async (req, res, next) => {
    const locationId = req.params.id
    if (!locationId) {
        res.status(400).send('Location ID is required.')
    }

    try {
        await locationLogic.delete(locationId)
        res.sendStatus(204)
    } catch (error) {
        sendError(res, error)
    }
})

export default router
