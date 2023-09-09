import { Router } from "express"
import User from '../controllers/user.js'

const router = Router()

router.route('/')
    .post(User.createUser)

router.route('/:userId')
    .get(User.getUser)

export default router