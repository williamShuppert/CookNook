import { Strategy } from 'passport-google-oauth2'
import { AuthService } from '../services/auth.js'
import { UsersService } from '../services/users.js'

export default new Strategy({
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {            
            const oauthUser = await AuthService(req.db).getOAuthUser(1, profile.id)
            
            if (!oauthUser) {
                // TODO: handle duplicate usernames
                const userId = await req.db.transaction(async () => {
                    const userId = await UsersService(req.db).createUser(profile.displayName, profile.email, null, profile.email_verified)
                    await AuthService(req.db).insertOAuthUser(1, profile.id, userId)
                    return userId
                })

                return done(null, { id: userId })
            }

            done(null, { id: oauthUser.userId })
        } catch(error) {
            done(error)
        }
    }
)