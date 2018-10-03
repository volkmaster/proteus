import 'babel-polyfill'
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import http from 'http'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
const debug = require('debug')('proteus:server')

import { normalizePort } from './utils/server-utils'

import userController from './controllers/user'
import routeController from './controllers/route'

const app = express()

// configuration
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// controllers
app.use('/api/users', userController)
app.use('/api/route', routeController)

// port
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

// server
const server = http.createServer(app)
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

module.exports = app
