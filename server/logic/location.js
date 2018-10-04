import Location from '../models/location'
import { formatError } from '../utils/error-utils'

module.exports = {
    all: async (data) => {
        try {
            if (!data) {
                data = { }
            } else if (Array.isArray(data)) {
                data = { '_id': { $in: data } }
            }
            const locations = await Location.find(data, '-__v')
            return locations
        } catch (error) {
            throw formatError(500, error)
        }
    },
    get: async (id) => {
        try {
            const location = await Location.findById(id, '-__v')
            return location
        } catch (error) {
            throw formatError(500, error)
        }
    },
    create: async (data) => {
        try {
            const location = new Location(data)
            await location.save()
            return location
        } catch (error) {
            throw formatError(500, error)
        }
    },
    update: async (id, data) => {
        try {
            await Location.findOneAndUpdate({ _id: id }, { $set: data }, {})
        } catch (error) {
            throw formatError(500, error)
        }
    },
    remove: async (id) => {
        try {
            await Location.remove({ _id: id })
        } catch (error) {
            throw formatError(500, error)
        }
    }
}
