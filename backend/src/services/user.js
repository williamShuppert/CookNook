import httpStatus from "http-status"
import User from "../models/user.js"
import { ApiError } from "../utils/api-error.js"
import bcrypt from 'bcrypt'

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
    },

    /**
     * Create a new user
     * @param {String} displayname
     * @param {String} email
     * @param {String} password
     * @returns {Promise<User>}
     */
    createUser: async (displayname, email, password) => {
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use')

        const encrypted = await bcrypt.hash(password, 12)
        return await User.create({ displayname, email, password: encrypted })
    }
}