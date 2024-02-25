import httpStatus from 'http-status';
import { accessCookieOptions, accessTokenName, refreshCookieOptions, refreshTokenName } from '../config/cookies.js';
import { catchAsync } from '../utils/catchAsync.js'
import { AuthService } from '../services/auth.js';

const sendAuthCookies = async (req, res, userId) => {
    res.cookie(
        refreshTokenName,
        await AuthService(req.db).createRefreshToken(userId),
        refreshCookieOptions)

    res.cookie(
        accessTokenName,
        await AuthService(req.db).createAccessToken(userId),
        accessCookieOptions)
}

export const loginSuccess = () => catchAsync(async (req, res) => {
    await sendAuthCookies(req, res, req.user.id)
    res.status(httpStatus.OK).send(req.user)
})

export const oauthSuccess = () => catchAsync(async (req, res) => {
    await sendAuthCookies(req, res, req.user.id)
    res.status(httpStatus.OK)
    res.redirect(`http://localhost:5173/CookNook/#/auth/callback?user=${JSON.stringify(req.user)}`)
})

export const logout = () => catchAsync(async (req, res) => {
    // TODO: invalidate refresh token
    res.clearCookie(refreshTokenName, refreshCookieOptions)
        .clearCookie(accessTokenName, accessCookieOptions)
        .sendStatus(httpStatus.OK)
})