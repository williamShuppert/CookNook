import { catchAsync } from '../utils/catchAsync.js'
import { UsersService } from '../services/users.js'
import httpStatus from 'http-status'
import { ApiError } from '../utils/apiError.js'
import { sendAuthCookies } from './auth.js'

export const createUser = () => catchAsync(async (req, res) => {
    const { username, email, password } = req.body

    const id = await UsersService(req.db).createUser(username, email ?? null, password)

    await sendAuthCookies(req, res, id)

    res.status(httpStatus.CREATED).send({
        id,
        username,
        email
    })
})

export const updateUser = () => catchAsync(async (req, res) => {
    const { id } = req.params
    const { username, email, newPassword, password } = req.body

    if (req.user.id != id) throw new ApiError(httpStatus.FORBIDDEN)

    await UsersService(req.db).updateUser(id, username, email == 'null' ? null : email, newPassword, password)

    res.sendStatus(httpStatus.OK)
})