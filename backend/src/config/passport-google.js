import { Strategy } from 'passport-google-oauth2'
import { useDbConn } from './mysql2.js'
import { v4 as uuid } from 'uuid';
import { ApiError } from '../utils/api-error.js';
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker';

export default new Strategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.DOMAIN}:${process.env.PORT}/auth/google/callback`,
    passReqToCallback: true
  }, (request, accessToken, refreshToken, profile, done) => useDbConn(async db => {
    try {
      const oauthUser = await db.execute("SELECT * FROM oauth JOIN users ON oauth.userId = users.id WHERE oauth.providerUserId = ? and providerId = 1", [profile.id], true)

      if (!oauthUser) {
        // check to see if email is already in use
        let res = await db.execute("SELECT * FROM users WHERE email = ?", [profile.email], true)
        if (res) throw new ApiError(httpStatus.BAD_REQUEST, 'Google account is already associated with an existing email')

        // check to see if username is already in use
        let username = profile.displayName
        res = await db.execute("SELECT * FROM users WHERE username = ?", [username], true)
        if (res) {
          // username already in use, generate a unique one
          let attempts = 0
          do {
            username = profile.displayName.substring(0, Math.min(str.length, 50-4)) // max length of 46
            username += faker.string.alphanumeric({length: 4, casing: false}) // append 4 more characters
            const isUnique = await db.execute("SELECT * FROM users WHERE username = ?", [username], true)
            if (isUnique) break
            attempts += 1
          } while (attempts < 4)
        }

        // user to create
        const user = {
          id: uuid(),
          displayname: profile.displayName.substring(0, Math.min(str.length, 50)),
          username,
          email: profile.email
        }
        db.transaction(async () => {
          await db.execute('INSERT INTO users (id, username, displayname, email) VALUES (?, ?, ?, ?)', [user.id, user.displayName, user.displayName, user.email])
          await db.execute('INSERT INTO oauth (providerName, providerUserId, userId) VALUES (?, ?, ?, ?)', ['google', profile.id, user.id])
        })

        // user successfully created
        return done(null, user)
      }

      const user = {
        id: oauthUser.id,
        username: oauthUser.username,
        displayname: oauthUser.displayName,
        email: oauthUser.email
      }
      return done(null, user) // user is verified
    } catch (error) {
      return done(error)
    }
  })
)