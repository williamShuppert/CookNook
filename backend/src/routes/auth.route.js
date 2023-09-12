import { Router } from "express"
// import UserValidation from "../validation/user.js"
import { validate } from "../middleware/validate.js"
import passport from "passport"
import authController from "../controllers/auth.controller.js"
import httpStatus from "http-status"
import { localLogin } from "../validation/auth.validation.js"

const router = Router()

router.post('/local', validate(localLogin), passport.authenticate('local', {session: false}), authController.sendAuthTokens)

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile']}))
router.get('/google/callback', passport.authenticate('google', {session: false}), authController.sendAuthTokens)

router.route('/refresh')
    .post(passport.authenticate('refresh-jwt', {session: false}), authController.sendAuthTokens)

router.route('/protected')
    .get(passport.authenticate('jwt', {session: false}), (req, res) => res.json({message:'just look at all these secrets...'}))

export default router

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authorization
 */

/**
 * @swagger
 * /auth/local:
 *   post:
 *     summary: Login in with a username and password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               username: fake
 *               password: password1
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 */