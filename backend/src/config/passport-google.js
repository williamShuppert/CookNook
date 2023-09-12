import { Strategy } from 'passport-google-oauth2'
import { usePool } from './mysql2.js'
import { v4 as uuid } from 'uuid';

export default new Strategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.DOMAIN}:${process.env.PORT}/auth/google/callback`,
    passReqToCallback: true
  }, (request, accessToken, refreshToken, profile, done) => usePool(async db => {
    try {
      const oauthUser = await db.execute("SELECT * FROM oauth JOIN users ON oauth.userId = users.id WHERE oauth.providerUserId = ? and providerName = 'not real';", [profile.id], true)

      if (!oauthUser) {
        const user = {
          id: uuid(),
          displayname: profile.displayName,
          username: profile.displayName,
          email: profile.email
        }
        db.transaction(async () => { // TODO: catch if username or email is already in use when signing up for oauth
          await db.execute('INSERT INTO users (id, username, displayname, email) VALUES (?, ?, ?, ?)', [user.id, profile.displayName, profile.displayName, profile.email])
          await db.execute('INSERT INTO oauth (providerName, providerUserId, userId) VALUES (?, ?, ?, ?)', ['google', profile.id, user.id])
        })

        return done(null, user)
      }

      const user = {
        id: oauthUser.id,
        username: oauthUser.username,
        email: oauthUser.email
      }
      return done(null, user)
    } catch (error) {
      return done(new ApiError(httpStatus.UNAUTHORIZED, httpStatus[httpStatus.UNAUTHORIZED]))
    }
  })
)