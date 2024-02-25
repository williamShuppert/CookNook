import httpStatus from 'http-status'
import { accessCookieOptions, accessTokenName, refreshCookieOptions, refreshTokenName } from '../config/cookies.js'
import { catchAsync } from '../utils/catchAsync.js'
import { AuthService } from '../services/auth.js'
import { ApiError } from '../utils/apiError.js'
import JWT from 'jsonwebtoken'

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
    res.redirect(process.env.OAUTH_SUCCESS_REDIRECT_URL + '?user=' + JSON.stringify(req.user))
})

export const logout = () => catchAsync(async (req, res) => {
    // TODO: invalidate refresh token
    res.clearCookie(refreshTokenName, refreshCookieOptions)
        .clearCookie(accessTokenName, accessCookieOptions)
        .sendStatus(httpStatus.OK)
})

export const refresh = () => catchAsync(async (req, res) => {
    const refreshJWT = req.cookies[refreshTokenName]
    
    if (!refreshJWT)
        throw new ApiError(httpStatus.UNAUTHORIZED)
    
    try {
        const decoded = JWT.verify(refreshJWT, process.env.REFRESH_JWT_SECRET)
        req.user = { id: decoded.userId }
    } catch (err) {
        console.log(err)
        throw new ApiError(httpStatus.UNAUTHORIZED)
    }

    // TODO: check database for revoked tokens

    await sendAuthCookies(req, res, req.user.id)
    res.status(httpStatus.OK).send(req.user)
})