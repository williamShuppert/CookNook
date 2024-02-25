import { Router } from "express"
import { useDB } from "../middleware/mysql2.js"
import { loginSuccess, logout, oauthSuccess, refresh } from "../controllers/auth.js"
import { localLoginValidation } from "../validation/auth.js"
import { validate } from "../middleware/validate.js"
import { usePassport } from "../config/passport.js"
import { protect } from "../middleware/auth.js"

const router = Router()

router.post('/local', validate(localLoginValidation), useDB(), usePassport('local'), loginSuccess())

router.post('/logout', protect(), useDB(), logout())

router.get('/google', usePassport('google', { scope: ['email', 'profile']}))
router.get('/google/callback', useDB(), usePassport('google'), oauthSuccess())

router.post('/refresh', useDB(), refresh())

export default router