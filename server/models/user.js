import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const schema = new mongoose.Schema({
    username: String,
    password: String,
    admin: Boolean,
    routes: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'routes' }
    ]
})

schema.pre('save', function(next) {
    const user = this

    if (!user.isModified('password')) {
        return next()
    }

    const password = user.password

    bcrypt.genSalt(10, (error, salt) => {
        if (error) {
            return next(error)
        }
        bcrypt.hash(password, salt, (error, hash) => {
            if (error) {
                return next(error)
            }
            user.password = hash
            next()
        })
    })
})

module.exports = mongoose.model('users', schema)
