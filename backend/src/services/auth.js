import JWT from 'jsonwebtoken'
import { accessTokenLifetime, refreshTokenLifetime } from '../config/cookies.js'
import { UsersService } from './users.js'
import { ApiError } from '../utils/apiError.js'
import httpStatus from 'http-status'
import bcrypt from 'bcrypt'

export const AuthService = (db) => ({
    createRefreshToken: async (userId) => {
        // TODO: Add to database
        return JWT.sign(
            { userId },
            process.env.REFRESH_JWT_SECRET,
            { expiresIn: refreshTokenLifetime / 1000 })
    },

    createAccessToken: (userId) => {
        return JWT.sign(
            { userId },
            process.env.ACCESS_JWT_SECRET,
            { expiresIn: accessTokenLifetime / 1000 })
    },

    validateRefreshToken: (token) => {
        // TODO: Check database for valid token, then remove if found
    },

    localLogin: async (username, email, password) => {
        const user = username // search by email if username is null
            ? await UsersService(db).getUserByUsername(username)
            : await UsersService(db).getUserByEmail(email)
        if (!user || !user.password)
            throw new ApiError(httpStatus.UNAUTHORIZED)

        const correctPassword = await bcrypt.compare(password, user.password)
        if (!correctPassword) throw new ApiError(httpStatus.UNAUTHORIZED)

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            emailVerified: user.emailVerified
        }
    },

    getOAuthUser: async (providerId, providerUserId) => {
        return await db.execute('SELECT * FROM oauth JOIN users ON userId = id WHERE providerId = ? and providerUserId = ?', [providerId, providerUserId], true)
    },

    insertOAuthUser: async (providerId, providerUserId, userId) => {
        return await db.execute('INSERT INTO oauth (providerId, providerUserId, userId) VALUES (?,?,?)', [providerId, providerUserId, userId])
    }
})