import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import userLogic from '../logic/user'
import { verifyToken } from '../middleware/middleware'
import { sendError } from '../utils/error-utils'

const router = express.Router()

router.post('/register', async (req, res, next) => {
    const data = req.body

    if (!data.username) {
        res.status(400).send('Username is required.')
    }

    if (!data.password) {
        res.status(400).send('Password is required.')
    }

    data['admin'] = false

    // Check if the user with the given username already exists
    const users = await userLogic.all({ username: data.username })
    if (users.length > 0) {
        return res.status(400).send('Username is already taken.')
    }

    try {
        const user = await userLogic.create(data)
        res.status(201).send(user._id)
    } catch (error) {
        sendError(res, error)
    }
})

router.post('/login', async (req, res, next) => {
    const data = req.body

    if (!data.username) {
        res.status(400).send('Username is required.')
    }

    if (!data.password) {
        res.status(400).send('Password is required.')
    }

    // Check if the user with the given username exists
    const users = await userLogic.all({ username: data.username }, false)
    if (users.length === 0) {
        return res.status(400).send('Invalid username.')
    }

    const user = users[0]

    // Compare passwords
    bcrypt.compare(data.password, user.password, (error, same) => {
        if (!same) {
            res.status(400).send('Invalid password.')
        } else {
             // Generate a token
            const payload = {
                id: user._id,
                username: user.username,
                admin: user.admin
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET)
            res.status(201).json({ token })
        }
    })
})

router.post('/logout', (req, res, next) => {
    res.status(200).send('User was successfully logged out.')
})

router.get('/verify', verifyToken, (req, res, next) => {
    res.status(200).send(true)
})

export default router
