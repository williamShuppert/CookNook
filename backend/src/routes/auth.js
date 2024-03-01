import { Router } from "express"
import base64url from "base64url"
import { useDB } from "../middleware/pg.js"
import { loginSuccess, logout, oauthSuccess, refresh } from "../controllers/auth.js"
import { localLoginValidation } from "../validation/auth.js"
import { validate } from "../middleware/validate.js"
import { usePassport } from "../config/passport.js"
import { requireAuth } from "../middleware/auth.js"
import JWT from 'jsonwebtoken'

const router = Router()

router.post('/local', validate(localLoginValidation), useDB(), usePassport('local'), loginSuccess())

router.post('/logout', requireAuth(), useDB(), logout())

router.get('/google', usePassport('google', {
    scope: ['email', 'profile'],
    state: base64url(JSON.stringify(JWT.sign(
        { action: 'login' },
        process.env.GOOGLE_STATE_JWT_SECRET
    )))
}))

router.get('/google/link', requireAuth(), (req, res, next) => usePassport('google', {
    scope: ['email', 'profile'],
    state: base64url(JSON.stringify(JWT.sign(
        { action: 'link', userId: req.user.id },
        process.env.GOOGLE_STATE_JWT_SECRET
    )))
})(req, res, next))

router.get('/google/callback', useDB(), usePassport('google'), oauthSuccess())

router.post('/refresh', useDB(), refresh())

export default router