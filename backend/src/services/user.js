import httpStatus from "http-status"
import User from "../models/user.js"
import { ApiError } from "../utils/api-error.js"

export default {
    /**
     * Get user by id
     * @param {ObjectId} id
     * @returns {Promise<User>}
     */
    getUserById: async (id) => {
        const user = await User.findByPk(id)
        if (!user)
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
        return user
    }
}