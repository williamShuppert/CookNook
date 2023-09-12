import { ExtractJwt, Strategy } from 'passport-jwt'
import { usePool } from './mysql2.js'

export const accessJWTStrategy = new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_JWT_SECRET,
}, async (payload, done) => {
    return done(null, payload.userId)
})

export const refreshJWTStrategy = new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.REFRESH_JWT_SECRET,
}, (payload, done) => usePool(async db => {
    // TODO: check token blacklist
    const user = await db.execute('SELECT * FROM users WHERE id = ?', [payload.userId], true)
    if (!user)
        return done(new ApiError(httpStatus.UNAUTHORIZED, httpStatus[httpStatus.UNAUTHORIZED]));
    return done(null, user);
}))