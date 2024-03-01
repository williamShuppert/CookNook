import { Strategy } from 'passport-google-oauth2'
import { AuthService } from '../services/auth.js'
import base64url from 'base64url'
import JWT from 'jsonwebtoken'

export default new Strategy({
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL,
        passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
        let state = {}
        try {
            state = JWT.verify(JSON.parse(base64url.decode(req.query.state)), process.env.GOOGLE_STATE_JWT_SECRET)
        } catch (err) {
            return done(err)
        }

        if (state.action == "login")
            AuthService(req.db).googleLogin(profile)
                .then(user => done(null, user))
                .catch(err => done(err))
        else if (state.action == "link")
            AuthService(req.db).linkGoogle(state.userId, profile)
                .then(user => done(null, user))
                .catch(err => done(err))
    }
)