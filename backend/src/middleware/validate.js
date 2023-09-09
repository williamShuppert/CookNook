export const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req, { abortEarly: false, allowUnknown: true })
    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ')
        return res.status(400).json({ error: errorMessage })
    }
    next()
}
