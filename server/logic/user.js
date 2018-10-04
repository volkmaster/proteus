import User from '../models/user'
import { formatError } from '../utils/error-utils'

module.exports = {
    all: async (data, hidePassword = true) => {
        try {
            if (!data) {
                data = { }
            } else if (Array.isArray(data)) {
                data = { '_id': { $in: data } }
            }
            const users = await User.find(data, '-__v' + (hidePassword ? ' -password' : '')).sort({ username: 1 })
            return users
        } catch (error) {
            throw formatError(500, error)
        }
    },
    get: async (id, hidePassword = true) => {
        try {
            const user = await User.findById(id, '-__v' + (hidePassword ? ' -password' : ''))
            return user
        } catch (error) {
            throw formatError(500, error)
        }
    },
    create: async (data) => {
        try {
            const user = new User(data)
            await user.save()
            return user
        } catch (error) {
            throw formatError(500, error)
        }
    },
    update: async (id, data) => {
        try {
            await User.findOneAndUpdate({ _id: id }, { $set: data }, {})
        } catch (error) {
            throw formatError(500, error)
        }
    },
    remove: async (id) => {
        try {
            await User.remove({ _id: id })
        } catch (error) {
            throw formatError(500, error)
        }
    }
}
