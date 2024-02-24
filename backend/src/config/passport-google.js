import { Strategy } from 'passport-google-oauth2'
import { AuthService } from '../services/auth.js'

export default new Strategy({
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
        passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
        AuthService(req.db).googleLogin(profile)
            .then(user => done(null, user))
            .catch(err => done(err))
    }
)