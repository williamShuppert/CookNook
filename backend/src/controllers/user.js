import { catchAsync } from "../utils/catch-async.js"
import { ApiError } from "../utils/api-error.js"
import httpStatus from 'http-status'
import UserService from '../services/user.js'

export default {
    getUser: catchAsync(async (req, res) => {
        const user = await UserService.getUserById(req.params.userId)
        const sanitized = {
            id: user.id,
            displayname: user.displayname
        }
        res.send(sanitized)
    })
} 