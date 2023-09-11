import { catchAsync } from "../utils/catch-async.js"
import { ApiError } from "../utils/api-error.js"
import httpStatus from 'http-status'
import UserService from '../services/user.js'
import tokenService from "../services/token.js"

export default {
    sendAuthTokens: catchAsync(async (req, res) => {
        const token = tokenService.generateToken(req.user.id, 'access')
        res.setHeader('Authorization', `Bearer ${token}`)
        res.json({
            id: req.user.id,
            username: req.user.username,
            displayname: req.user.displayname,
            email: req.user.email
        })
    })
} 