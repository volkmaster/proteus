import express from 'express'
const router = express.Router()

import userLogic from '../logic/user'
import { sendError } from '../utils/error-utils'

router.get('/:id', async (req, res, next) => {
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

export default router
