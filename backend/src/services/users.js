import { v4 as UUID } from 'uuid'
import bcrypt from 'bcrypt'
import { getDuplicateEntryKey } from '../utils/mysql2Errors.js'
import { ApiError } from '../utils/apiError.js'
import httpStatus from 'http-status'

export const UsersService = (db) => ({
    createUser: async (username, email, password, emailVerified = false) => {
        const id = UUID()
        const hashed = password ? await bcrypt.hash(password, 12) : null

        await db.execute('INSERT INTO users (id, email, username, password, emailVerified) VALUES (?,?,?,?,?)', [id, email, username, hashed, emailVerified])
            .catch(error => {
                const key = getDuplicateEntryKey(error)
                if (!key) throw error
                throw new ApiError(httpStatus.CONFLICT, key + ' already in use')
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
        const emailVerified = email == user.email && user.emailVerified

        await db.execute('UPDATE users SET email = ?, username = ?, password = ?, emailVerified = ?, lastUpdated = CURRENT_TIMESTAMP WHERE id = ?', [email, username, hashed, emailVerified, id])
            .catch(error => {
                const key = getDuplicateEntryKey(error)
                if (!key) throw error
                throw new ApiError(httpStatus.CONFLICT, key + ' already in use')
            })
    },
    getUserById: async (id) => {
        return await db.execute("SELECT * FROM users WHERE id = ?", [id], true)
    },
    getUserByUsername: async (username) => {
        return await db.execute('SELECT * FROM users WHERE username = ?', [username], true)
    },
    getUserByEmail: async (email) => {
        return await db.execute('SELECT * FROM users WHERE email = ?', [email], true)
    }
})