import express from 'express'
import path from 'path'

const router = express.Router()

router.get('/', (req, res, next) => {
    res.render('index.html', { root: path.join(__dirname, 'public') })
})

module.exports = router
