import httpStatus from 'http-status';
import { accessCookieOptions, accessTokenName, refreshCookieOptions, refreshTokenName } from '../config/cookies.js';
import { catchAsync } from '../utils/catchAsync.js'
import { AuthService } from '../services/auth.js';

export const localLogin = () => catchAsync(async (req, res) => {
    const { username, email, password } = req.body

    const user = await AuthService(req.db).localLogin(username, email, password)

    res.cookie(
        refreshTokenName,
        await AuthService(req.db).createRefreshToken(user.id),
        refreshCookieOptions)

    res.cookie(
        accessTokenName,
        await AuthService(req.db).createAccessToken(user.id),
        accessCookieOptions)

    res.sendStatus(httpStatus.OK)
})

export const logout = () => catchAsync(async (req, res) => {
    // TODO: invalidate refresh token
    res.clearCookie(refreshTokenName, refreshCookieOptions)
        .clearCookie(accessTokenName, accessCookieOptions)
        .sendStatus(httpStatus.OK)
})