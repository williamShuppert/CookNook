import passport from "passport"
import googleStrategy from './passport-google.js'

passport.use('google', googleStrategy)