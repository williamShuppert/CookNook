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
        await db.execute('INSERT INTO refresh_tokens (id, userId) VALUES (?,?)', [tokenId, userId])

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
        const res = (await db.conn.execute('DELETE FROM refresh_tokens WHERE id = ?', [decodedToken.tokenId]))[0]

        if (res.affectedRows != 1)
            throw new ApiError(httpStatus.UNAUTHORIZED)
    },

    removeRefreshTokenByUser: async (userId) => {
        await db.execute('DELETE FROM refresh_tokens WHERE userId = ?', [userId])
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

    googleLogin: async (profile) => {
        const oauthUser = await AuthService(db).getOAuthUser(1, profile.id)
            
        if (!oauthUser) {
            // TODO: handle duplicate usernames
            const userId = await db.transaction(async () => {
                const userId = await UsersService(db).createUser(profile.displayName, profile.email, null, profile.email_verified)
                await AuthService(db).insertOAuthUser(1, profile.id, userId)
                return userId
            })

            return { id: userId }
        }

        return { id: oauthUser.userId }
    },

    getOAuthUser: async (providerId, providerUserId) => {
        return await db.execute('SELECT * FROM oauth JOIN users ON userId = id WHERE providerId = ? and providerUserId = ?', [providerId, providerUserId], true)
    },

    insertOAuthUser: async (providerId, providerUserId, userId) => {
        return await db.execute('INSERT INTO oauth (providerId, providerUserId, userId) VALUES (?,?,?)', [providerId, providerUserId, userId])
    }
})