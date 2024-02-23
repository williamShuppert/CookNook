import { catchAsync } from '../utils/catchAsync.js'
import { UsersService } from '../services/users.js'
import httpStatus from 'http-status'

export const createUser = () => catchAsync(async (req, res) => {
    const { username, email, password } = req.body

    const id = await UsersService(req.db).createUser(username, email, password)

    res.status(httpStatus.CREATED).send({
        id,
        username,
        email
    })
})

export const updateUser = () => catchAsync(async (req, res) => {
    const { id } = req.params
    const { username, email, newPassword, password } = req.body

    await UsersService(req.db).updateUser(id, username, email, newPassword, password)

    res.sendStatus(httpStatus.OK)
})