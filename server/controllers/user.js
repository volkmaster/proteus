import express from 'express'

import userLogic from '../logic/user'
import { verifyToken, verifyAdmin, verifyIdMatch } from '../middleware/middleware'
import { sendError } from '../utils/error-utils'

const router = express.Router()
router.use(verifyToken)

router.get('/', async (req, res, next) => {
    try {
        const users = await userLogic.all()
        res.status(200).json(users)
    } catch (error) {
        sendError(res, error)
    }
})

router.get('/me', async (req, res, next) => {
    try {
        const user = await userLogic.get(req.decoded.id)
        res.status(200).json(user)
    } catch (error) {
        sendError(res, error)
    }
})

router.get('/:id', verifyIdMatch, async (req, res, next) => {
    const userId = req.params.id
    if (!userId) {
        res.status(400).send('User ID is required.')
    }

    try {
        const user = await userLogic.get(userId)
        res.status(200).json(user)
    } catch (error) {
        sendError(res, error)
    }
})

router.patch('/:id', verifyIdMatch, async (req, res, next) => {
    const userId = req.params.id
    if (!userId) {
        res.status(400).send('User ID is required.')
    }

    const data = req.body

    try {
        await userLogic.update(userId, data)
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
        await userLogic.delete(userId)
        res.sendStatus(204)
    } catch (error) {
        sendError(res, error)
    }
})

export default router
