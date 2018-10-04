import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import mongoose from 'mongoose'
import 'babel-polyfill'
import http from 'http'
import cookieParser from 'cookie-parser'
import path from 'path'
import logger from 'morgan'
const debug = require('debug')('proteus:server')

import authController from './controllers/auth'
import userController from './controllers/user'
import routeController from './controllers/route'

import { normalizePort } from './utils/server-utils'

const app = express()

// configuration
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// controllers
app.use('/api/auth', authController)
app.use('/api/users', userController)
app.use('/api/routes', routeController)

// database
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, (error) => {
    if (error) {
        throw error
    }

    console.log('Connected to mongo database...')

    // server
    const server = http.createServer(app)
    const port = normalizePort(process.env.PORT || '3000')
    server.listen(port)

    server.on('error', (error) => {
        if (error.syscall !== 'listen') {
            throw error
        }

        const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges')
                process.exit(1)
                break
            case 'EADDRINUSE':
                console.error(bind + ' is already in use')
                process.exit(1)
                break
            default:
                throw error
        }
    })

    server.on('listening', () => {
        const address = server.address()
        const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port
        debug('Listening on ' + bind)
    })
})

module.exports = app
