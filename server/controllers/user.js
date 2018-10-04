import express from 'express'
const router = express.Router()

import user from '../models/user'
import userLogic from '../logic/user'
import { verifyToken } from '../middleware/verifyToken'
import { verifyAdmin } from '../middleware/verifyAdmin'
import { verifyIdMatch } from '../middleware/verifyAdmin'
import { sendError } from '../utils/error-utils'

router.use(verifyToken);

router.get('/', async (req, res, next) => {
    try {
        const users = await (User.find({}, '-_id -admin -password -__v').sort({ username: -1 }))
        res.status(200).send(users)
    } catch (error) {
        sendError(res, error)
    }
})

router.get('/me', async (req, res, next) => {
    try {
        const user = await (User.findById(req.decoded.id, '-password -__v'))
        res.status(200).send(user)
    } catch (error) {
        res.sendStatus(404)
    }
})

router.get('/:id', verifyIdMatch, async (req, res, next) => {
    const userId = req.params.id
    if (!userId) {
        res.status(400).send('User ID is required.')
    }

    try {
        const user = await userLogic.get(userId)
        res.json(user)
    } catch (error) {
        sendError(res, error)
    }
})

router.put('/:id', verifyIdMatch, async (req, res, next) => {
    const userId = req.params.id
    if (!userId) {
        res.status(400).send('User ID is required.')
    }

    if (userId !== req.decoded.id && !req.decoded.admin) {
        res.sendStatus(401)
    }

    const data = req.body

    try {
        await User.findOneAndUpdate({ _id: userId }, { $set: data }, {})
        res.sendStatus(204)
    } catch (error) {
        sendError(res, error)
    }
})

router.delete('/:id', [verifyAdmin, verifyIdMatch], async (req, res, next) => {
    const userId = req.params.id
    if (!userId) {
        res.status(400).send('User ID is required.')
    }

    try {
        await (User.remove({ _id: userId }))
        res.sendStatus(204)
    } catch (error) {
        sendError(res, error)
    }
})

export default router
