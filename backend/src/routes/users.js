import { Router } from "express"
import User from '../controllers/users.js'

const router = Router()

router.route('/:userId')
    .get(User.getUser)

export default router