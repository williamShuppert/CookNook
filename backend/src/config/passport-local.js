import { Strategy } from "passport-local"
import { AuthService } from "../services/auth.js"

export default new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    AuthService(req.db).localLogin(username, req.body.email, password)
        .then(user => done(null, user))
        .catch(err => done(err))
})