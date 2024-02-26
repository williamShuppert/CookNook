import httpStatus from 'http-status'
import { cookieConfig } from '../config/cookies.js'
import { catchAsync } from '../utils/catchAsync.js'
import { AuthService } from '../services/auth.js'
import { ApiError } from '../utils/apiError.js'
import JWT from 'jsonwebtoken'

export const sendAuthCookies = async (req, res, userId) => {
    res.cookie(
        cookieConfig.refresh.name,
        await AuthService(req.db).createRefreshToken(userId),
        cookieConfig.refresh.options)

    res.cookie(
        cookieConfig.access.name,
        await AuthService(req.db).createAccessToken(userId),
        cookieConfig.access.options)
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
    await AuthService(req.db).removeRefreshTokenByUser(req.user.id)
    res.clearCookie(cookieConfig.refresh.name, cookieConfig.refresh.options)
        .clearCookie(cookieConfig.access.name, cookieConfig.access.options)
        .sendStatus(httpStatus.OK)
})

export const refresh = () => catchAsync(async (req, res) => {
    const refreshJWT = req.cookies[cookieConfig.refresh.name]
    
    if (!refreshJWT)
        throw new ApiError(httpStatus.UNAUTHORIZED)
    
    try {
        const decoded = JWT.verify(refreshJWT, process.env.REFRESH_JWT_SECRET)
        await AuthService(req.db).validateRefreshToken(decoded)

        req.user = { id: decoded.userId }
    } catch (err) {
        console.log(err)
        throw new ApiError(httpStatus.UNAUTHORIZED)
    }


    await sendAuthCookies(req, res, req.user.id)
    res.status(httpStatus.OK).send(req.user)
})