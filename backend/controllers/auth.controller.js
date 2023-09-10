import { catchAsync } from "../utils/catch-async.js"
import { ApiError } from "../utils/api-error.js"
import httpStatus from 'http-status'
import UserService from '../services/user.js'
import jwt from "jsonwebtoken"

export default {
    sendAuthTokens: catchAsync(async (req, res) => {
        const token = jwt.sign({ userId: req.user.id }, process.env.ACCESS_JWT_SECRET, { expiresIn: '1h' }) // TODO: move to service
        res.setHeader('Authorization', `Bearer ${token}`)
        res.json({
            id: req.user.id,
            username: req.user.username,
            displayname: req.user.displayname,
            email: req.user.email
        })
    })
} 