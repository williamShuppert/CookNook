import httpStatus from "http-status"
import User from "../models/user.model.js"
import { ApiError } from "../utils/api-error.js"
import { Op } from 'sequelize'
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
     * @param {String} username
     * @param {String} displayname
     * @param {String} email
     * @param {String} password
     * @returns {Promise<User>}
     */
    createUser: async (email, username, displayname, password) => {
        const existingUser = await User.findOne({ where: { [Op.or]: [{email},{username}] } })
        if (existingUser)
            if (existingUser.email == email && existingUser.username == username)
                throw new ApiError(httpStatus.BAD_REQUEST, 'Email and username already in use')
            else if (existingUser.email == email)
                throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use')
            else
                throw new ApiError(httpStatus.BAD_REQUEST, 'Username already in use')

        const encrypted = await bcrypt.hash(password, 12)
        return await User.create({ email, username, displayname, password: encrypted })
    }
}