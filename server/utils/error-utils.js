module.exports = {
    formatResponseError: (status, errors) => {
        return {
            status: status,
            content: errors.map(error => {
                const formattedError = { message: error.message }
                if (error.problems) {
                    formattedError['problems'] = error.problems.map(problem => problem.explanation)
                }
                return formattedError
            })
        }
    },
    formatUserError: (status, errors) => {
        return { status, content: errors }
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
