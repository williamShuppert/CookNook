import { catchAsync } from '../utils/catchAsync.js'
import { UsersService } from '../services/users.js'
import httpStatus from 'http-status'
import { AuthService } from '../services/auth.js'
import { accessCookieOptions, accessTokenName, refreshCookieOptions, refreshTokenName } from '../config/cookies.js'

export const createUser = () => catchAsync(async (req, res) => {
    const { username, email, password } = req.body

    const id = await UsersService(req.db).createUser(username, email, password)

    res.cookie(
        refreshTokenName,
        await AuthService(req.db).createRefreshToken(id),
        refreshCookieOptions)

    res.cookie(
        accessTokenName,
        await AuthService(req.db).createAccessToken(id),
        accessCookieOptions)

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