import { ApiError } from "../utils/apiError.js"
import httpStatus from "http-status"

export const errorConverter = (err, req, res, next) => {
    let error = err
    if (!(error instanceof ApiError)) {
        const statusCode = httpStatus.INTERNAL_SERVER_ERROR
        const message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
        error = new ApiError(statusCode, message, false, err.stack)
    }
    next(error)
}

export const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err

    if (process.env.NODE_ENV !== 'dev' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    if (process.env.NODE_ENV === 'dev' && !err.isOperational)
        console.log(err)

    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === 'dev' && { stack: err.stack }),
    }

    res.status(statusCode).send(response)
}