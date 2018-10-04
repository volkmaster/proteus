import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    route: Object
})

module.exports = mongoose.model('routes', schema)
