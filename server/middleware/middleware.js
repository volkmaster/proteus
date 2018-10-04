const jwt = require('jsonwebtoken')

module.exports = {
    verifyToken: (req, res, next) => {
        const token = req.body.token || req.query.token || req.headers['x-access-token']

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(404).send('Failed to authenticate token')
                } else {
                    req.decoded = decoded
                    next()
                }
            })
        } else {
            res.status(403).send('No token provided')
        }
    },
    verifyAdmin: (req, res, next) => {
        if (req.decoded.admin) {
            next()
        } else {
            res.status(401).send('You are not an administrator.')
        }
    },
    verifyIdMatch: (req, res, next) => {
        if (req.params.id === req.decoded.id || req.decoded.admin) {
            next()
        } else {
            res.sendStatus(401)
        }
    }
}
