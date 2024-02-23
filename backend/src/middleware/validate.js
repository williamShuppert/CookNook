import httpStatus from "http-status"

export const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req, { abortEarly: false, allowUnknown: true })
    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ')
        return res.status(httpStatus.BAD_REQUEST).json({ code: httpStatus.BAD_REQUEST, message: errorMessage })
    }
    next()
}