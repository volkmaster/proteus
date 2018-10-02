import { formatResponseError } from '../utils/error-utils'

module.exports = {
    get: async (id) => {
        const response = await ...

        const errors = response.errors
        if (errors) {
            throw formatResponseError(400, errors)
        }

        return response.data
    }
}
