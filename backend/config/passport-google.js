import { Strategy } from 'passport-google-oauth2'
import User from '../models/user.model.js'
import OAuth from '../models/oauth.model.js'

export default new Strategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.DOMAIN}:${process.env.PORT}/auth/google/callback`,
    passReqToCallback: true
  }, async (request, accessToken, refreshToken, profile, done) => {
    try {

      // TODO: move all models out, should be calling controllers instead, this is basically a route

      // const user = await userController.findOrCreateOAuthUser('google', profile)
      // return done(null, user) or done(error, false)


      const oauthUser = await OAuth.findOne({where: {id: profile.id}})

      if (!oauthUser) {
        // If the user does not exist, create a new user
        
        // need to check for password and username

        // create user
        const user = await User.create({
          username: profile.displayName,
          displayname: profile.displayName,
          email: profile.email
        })

        // Store OAuth information in the oauth table
        await OAuth.create({
          userId: user.id,
          provider: 'google',
          id: profile.id
        })

        request.user = user.get({plain:true})

        return done(null, user.get({plain:true}))
      }

      const user = await User.findByPk(oauthUser.userId)

      return done(null, user.get({plain:true}))
    } catch (error) {
      return done(error, false)
    }
  }
)