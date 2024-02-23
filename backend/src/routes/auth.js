import { Router } from "express"
import { useDB } from "../middleware/mysql2.js"
import { localLogin, logout } from "../controllers/auth.js"
import { localLoginValidation } from "../validation/auth.js"
import { validate } from "../middleware/validate.js"

const router = Router()

router.post('/local', validate(localLoginValidation), useDB(), localLogin())

router.post('/logout', useDB(), logout())

export default router