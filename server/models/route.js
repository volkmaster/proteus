import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    nodes: Object
})

module.exports = mongoose.model('routes', schema)
