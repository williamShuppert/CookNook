import { v4 as UUID } from 'uuid'
import bcrypt from 'bcrypt'
import { ApiError } from '../utils/apiError.js'
import httpStatus from 'http-status'

export const UsersService = (db) => ({
    createUser: async (username, email, password, emailVerified = false, googleId = null) => {
        const id = UUID()
        const hashed = password ? await bcrypt.hash(password, 12) : null

        await db.query('INSERT INTO users (user_id, email, username, password, email_verified, google_id) VALUES ($1,$2,$3,$4,$5,$6)', [id, email, username, hashed, emailVerified, googleId])
            .catch(err => {
                if (err.code == 23505) {
                    const column = err.detail.slice(err.detail.indexOf('(') + 1, err.detail.indexOf(')'))
                    throw new ApiError(httpStatus.CONFLICT, `${column} already in use`)
                }
                throw err
            })

        return id
    },
    updateUser: async (id, username, email, newPassword, password) => {
        const user = await UsersService(db).getUserById(id)
        if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'user not found')

        // Keep previous values if new values are empty
        username = username ?? user.username
        email = email === undefined ? user.email : email
        newPassword = newPassword ?? password

        const correctPassword = user.password ? await bcrypt.compare(password, user.password) : true
        if (!correctPassword) throw new ApiError(httpStatus.UNAUTHORIZED, 'incorrect password')

        const hashed = await bcrypt.hash(newPassword, 12)
        const emailVerified = email == user.email && user.emailVerified && user.email !== null

        await db.query('UPDATE users SET email = $1, username = $2, password = $3, email_verified = $4, updated_at = CURRENT_TIMESTAMP WHERE user_id = $5', [email, username, hashed, emailVerified, id])
            .catch(err => {
                if (err.code == 23505) {
                    const column = err.detail.slice(err.detail.indexOf('(') + 1, err.detail.indexOf(')'))
                    throw new ApiError(httpStatus.CONFLICT, `${column} already in use`)
                }
            })
    },
    getUserById: async (id) => {
        return (await db.query('SELECT * FROM users WHERE user_id = $1', [id])).rows[0]
    },
    getUserByUsername: async (username) => {
        return (await db.query('SELECT * FROM users WHERE username = $1', [username])).rows[0]
    },
    getUserByEmail: async (email) => {
        return (await db.query('SELECT * FROM users WHERE email = $1', [email])).rows[0]
    },
    getUserByGoogleId: async (googleId) => {
        return (await db.query('SELECT * FROM users WHERE google_id = $1', [googleId])).rows[0]
    }
})