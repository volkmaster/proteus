import jwt from 'jsonwebtoken'

module.exports = {
    verifyToken: (req, res, next) => {
        let token = req.headers['Authorization'] || req.headers['authorization']

        if (token) {
            token = token.replace('Bearer ', '')
            jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
                if (error) {
                    return res.status(404).send('Failed to authenticate token.')
                } else {
                    req.decoded = decoded
                    next()
                }
            })
        } else {
            res.status(403).send('No token provided.')
        }
    },
    verifyAdmin: (req, res, next) => {
        if (req.decoded.admin) {
            next()
        } else {
            res.status(403).send('You are not an administrator.')
        }
    },
    verifyIdMatch: (req, res, next) => {
        if (req.params.id === req.decoded.id || req.decoded.admin) {
            next()
        } else {
            res.sendStatus(403).send('You do not have rights to modify this resource.')
        }
    }
}
