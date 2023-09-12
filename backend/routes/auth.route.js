import { Router } from "express"
// import UserValidation from "../validation/user.js"
import { validate } from "../middleware/validate.js"
import passport from "passport"
import authController from "../controllers/auth.controller.js"
import httpStatus from "http-status"

const router = Router()

router.post('/local', passport.authenticate('local', {session: false}), authController.sendAuthTokens)

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile']}))
router.get('/google/callback', passport.authenticate('google', {session: false}), authController.sendAuthTokens)

router.route('/refresh')
    .post(passport.authenticate('refresh-jwt', {session: false}), authController.sendAuthTokens)

router.route('/protected')
    .get(passport.authenticate('jwt', {session: false}), (req, res) => res.json({message:'just look at all these secrets...'}))

export default router