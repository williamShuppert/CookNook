import httpStatus from "http-status"

export class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, stack = '') {
        if (!statusCode)
            statusCode = httpStatus.INTERNAL_SERVER_ERROR
        
        if (!message)
            message = httpStatus[statusCode]

        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational
        if (stack)
            this.stack = stack
        else
            Error.captureStackTrace(this, this.constructor)
    }
}