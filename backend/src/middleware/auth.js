import { accessTokenName } from "../config/cookies.js"
import JWT from 'jsonwebtoken'
import { ApiError } from "../utils/apiError.js"
import httpStatus from "http-status"

export const protect = () => (req, res, next) => {
    const accessJWT = req.cookies[accessTokenName]

    if (!accessJWT)
        throw new ApiError(httpStatus.UNAUTHORIZED)

    try {
        const decoded = JWT.verify(accessJWT, process.env.ACCESS_JWT_SECRET)
        req.user = { id: decoded.userId }
    } catch {
        throw new ApiError(httpStatus.FORBIDDEN)
    }

    next()
}