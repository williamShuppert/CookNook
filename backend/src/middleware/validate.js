import httpStatus from "http-status"

export const validate = (schema) => (req, res, next) => {
    const { value, error } = schema.validate(req, { abortEarly: false, allowUnknown: true })
    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ')
        return res.status(httpStatus.BAD_REQUEST).json({ code: httpStatus.BAD_REQUEST, message: errorMessage })
    }
    
    // Assign validated req values to original req object
    Object.keys(value).forEach(key => {
        req[key] = value[key]
    })

    next()
}