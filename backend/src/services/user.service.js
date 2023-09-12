import httpStatus from "http-status"
import bcrypt from 'bcrypt'
import { usePool } from "../config/mysql2.js"
import { ApiError } from "../utils/api-error.js"
import { v4 as uuid } from "uuid"

export default {
    /**
     * Get user by id
     * @param {ObjectId} id
     * @returns {Promise<any>}
     */
    getUserById: (id) => usePool(async db => {
        const user = await db.execute(`select * from users where id = ?`, [id], true)
        if (!user)
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
        return user
    }),

    /**
     * Create a new local user
     * @param {String} username
     * @param {String} displayname
     * @param {String} email
     * @param {String} password
     * @returns {Promise<User>}
     */
    createLocalUser: (email, username, displayname, password) => usePool(async db => {
        const existingEmail = await db.execute('select * from users where email = ?', [email], true)
        const existingUsername = await db.execute('select * from users where username = ?', [username], true)

        if (existingEmail && existingUsername)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email and username already in use')
        else if (existingEmail)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use')
        else if (existingUsername)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Username already in use')

        const encrypted = await bcrypt.hash(password, 12)

        const user = {
            id: uuid(),
            username,
            email,
            displayname
        }

        await db.execute('INSERT INTO users (id,email,username,displayname,password) VALUES (?, ?, ?, ?, ?)', [user.id,email,username,displayname,encrypted], true)

        return user;
    })
}