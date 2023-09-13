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
 *   description: User auth
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

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Login in with Google OAuth2.0
 *     x-execute: false
 *     description: |
 *       This endpoint performs a redirection to another URL under certain conditions.
 *       
 *       When making a request to this endpoint, it may respond with an HTTP 302 (Found) status code,
 *       which indicates a redirection. The redirection URL and conditions are specified based on
 *       the request parameters.
 *
 *       Note: This redirection cannot be tested directly within the Swagger interface. 
 *       Refer to the external documentation for more details on the redirection flow.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '302':
 *         description: Found
 *         headers:
 *           Location:
 *             description: The URL to which the redirection occurs.
 *             schema:
 *               type: string
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized
 */