import { ExtractJwt, Strategy } from 'passport-jwt'
import User from '../models/user.model.js'

export const accessJWTStrategy = new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_JWT_SECRET,
}, async (payload, done) => {
    return done(null, payload.userId)
})

export const refreshJWTStrategy = new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.REFRESH_JWT_SECRET,
}, async (payload, done) => {
    // TODO: check token blacklist
    const user = await User.findByPk(payload.userId)
    if (!user)
        return done(null, false);
    return done(null, user);
})