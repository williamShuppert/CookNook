import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'
import { useDbConn } from './mysql2.js'
import httpStatus from 'http-status'
import { ApiError } from '../utils/api-error.js'

export default new LocalStrategy((username, password, done) => useDbConn(async db => {
    let user = await db.execute('SELECT * FROM users WHERE username = ?', [username], true)

    if (!user)
        return done(new ApiError(httpStatus.UNAUTHORIZED, httpStatus[httpStatus.UNAUTHORIZED]))

    const correctPassword = await bcrypt.compare(password, user.password)

    if (!correctPassword)
        return done(new ApiError(httpStatus.UNAUTHORIZED, httpStatus[httpStatus.UNAUTHORIZED]))

    user = {
        id: user.id,
        email: user.email,
        displayname: user.displayname,
        username: user.username
    }
    return done(null, user)
}))