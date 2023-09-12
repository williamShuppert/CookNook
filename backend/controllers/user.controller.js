import { catchAsync } from "../utils/catch-async.js"
import httpStatus from 'http-status'
import UserService from '../services/user.service.js'

export default {
    getUser: catchAsync(async (req, res) => {
        const user = await UserService.getUserById(req.params.userId)
        const sanitized = {
            id: user.id,
            displayname: user.displayname
        }
        res.send(sanitized)
    }),

    createUser: catchAsync(async (req, res) => {
        const { displayname, username, email, password } = req.body
        const user = await UserService.createLocalUser(email, username, displayname, password)
        const sanitized = {
            id: user.id,
            displayname: user.displayname,
            username: user.username,
            email: user.email
        }
        res.status(httpStatus.CREATED).send(sanitized)
    }),
} 