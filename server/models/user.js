import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    admin: Boolean
})

userSchema.pre('save', function(next) {
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

module.exports = mongoose.model('users', userSchema)
