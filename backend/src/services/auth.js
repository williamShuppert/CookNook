import JWT from 'jsonwebtoken'
import { v4 as UUID } from 'uuid'
import { cookieConfig } from '../config/cookies.js'
import { UsersService } from './users.js'
import { ApiError } from '../utils/apiError.js'
import httpStatus from 'http-status'
import bcrypt from 'bcrypt'

export const AuthService = (db) => ({
    createRefreshToken: async (userId) => {
        const tokenId = UUID()
        await db.query('INSERT INTO refresh_tokens (token_id, user_id, expires_at) VALUES ($1,$2,$3)', [
            tokenId,
            userId,
            new Date(new Date().getTime() + cookieConfig.refresh.options.maxAge)
        ])

        return JWT.sign(
            { userId, tokenId },
            process.env.REFRESH_JWT_SECRET,
            { expiresIn: cookieConfig.refresh.options.maxAge / 1000 })
    },

    createAccessToken: (userId) => {
        return JWT.sign(
            { userId },
            process.env.ACCESS_JWT_SECRET,
            { expiresIn: cookieConfig.access.options.maxAge / 1000 })
    },

    validateRefreshToken: async (decodedToken) => {
        const res = await db.query('DELETE FROM refresh_tokens WHERE token_id = $1', [decodedToken.tokenId])

        if (res.rowCount != 1)
            throw new ApiError(httpStatus.UNAUTHORIZED)
    },

    removeRefreshTokenByUser: async (userId) => {
        await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId])
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
            id: user.user_id,
            username: user.username,
            email: user.email,
            emailVerified: user.email_verified
        }
    },

    googleLogin: async (profile) => {
        const user = await UsersService(db).getUserByGoogleId(profile.id)
            
        if (!user) {
            // TODO: handle duplicate usernames
            const userId = await UsersService(db).createUser(
                profile.displayName,
                profile.email,
                null,
                profile.email_verified,
                profile.id
            )

            return { id: userId }
        }

        return { id: user.user_id }
    },
})