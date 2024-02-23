import { Router } from "express"
import { useDB } from "../middleware/mysql2.js"
import { googleLogin, localLogin, logout } from "../controllers/auth.js"
import { localLoginValidation } from "../validation/auth.js"
import { validate } from "../middleware/validate.js"
import passport from "passport"

const router = Router()

router.post('/local', validate(localLoginValidation), useDB(), localLogin())

router.post('/logout', useDB(), logout())

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile']}))
router.get('/google/callback', useDB(), passport.authenticate('google', {session: false}), googleLogin())

export default router