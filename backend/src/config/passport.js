import passport from "passport"
import { accessJWTStrategy, refreshJWTStrategy } from "./passport-jwt.js"
import localStrategy from './passport-local.js'
import googleStrategy from './passport-google.js'

passport.use('local', localStrategy)
passport.use('jwt', accessJWTStrategy)
passport.use('refresh-jwt', refreshJWTStrategy)
passport.use('google', googleStrategy)