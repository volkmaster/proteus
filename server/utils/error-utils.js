module.exports = {
    formatError: (status, error) => {
        return { status, content: error }
    },
    sendError: (res, error) => {
        if (error.message) {
            res.status(error.status).send(error.message)
        } else if (error.content) {
            res.status(error.status).json(error.content)
        } else {
            res.sendStatus(error.status)
        }
    }
}
