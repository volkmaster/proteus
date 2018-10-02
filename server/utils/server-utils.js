module.exports = {
    normalizePort: (value) => {
        const port = parseInt(value, 10)

        if (isNaN(port)) {
            // named pipe
            return value
        }

        if (port >= 0) {
            // port number
            return port
        }

        return false
    }
}
