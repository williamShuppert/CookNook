import { Router } from "express"
import { createUser, updateUser} from "../controllers/users.js"
import { useDB } from "../middleware/mysql2.js"
import { validate } from "../middleware/validate.js"
import { createUserValidation, updateUserValidation } from "../validation/users.js"
import { protect } from "../middleware/auth.js"

const router = Router()

router.route('/')
    .post(validate(createUserValidation), useDB(), createUser())

router.route('/:id')
    .patch(validate(updateUserValidation), protect(), useDB(), updateUser())

export default router