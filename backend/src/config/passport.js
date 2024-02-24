import passport from "passport"
import googleStrategy from './passport-google.js'
import localStrategy from './passport-local.js'

passport.use('local', localStrategy)
passport.use('google', googleStrategy)

export const usePassport = (strategy, options, callback) => {
    return passport.authenticate(strategy, { session: false, ...options }, callback)
}