import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    Avtorji: String,
    Datacija: String,
    ESD: Number,
    LokacijaOp: String,
    Podrocja: String,
    Sinonimi: String,
    Varstvo: String,
    Zavod: String,
    Zvrst: String,
    address: String,
    city: String,
    description: String,
    descriptionEn: String,
    keywords: String,
    latitude: Number,
    longitude: Number,
    name: String,
    postal_code: Number,
    region: String,
    type: String
})

module.exports = mongoose.model('locations', schema)
