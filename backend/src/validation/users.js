import Joi from 'joi'

export const validPassword = Joi.string().min(6)
export const validEmail = Joi.string().email()
export const validUsername = Joi.string().min(3).max(50)

export const createUserValidation = Joi.object().keys({
    body: Joi.object().keys({
        email: validEmail.allow(null),
        username: validUsername.required(),
        password: validPassword.required()
    })
})

export const updateUserValidation = Joi.object().keys({
    body: Joi.object().keys({
        email: validEmail,
        username: validUsername,
        password: Joi.string().required(),
        newPassword: validPassword
    }),
    params: Joi.object().keys({
        id: Joi.string().guid({ version: 'uuidv4' })
    })
})