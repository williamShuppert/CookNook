import Joi from 'joi'

export const validPassword = Joi.string().min(8)
export const validEmail = Joi.string().email()
export const validDisplayname = Joi.string().min(3).max(50)
export const validUsername = Joi.string().min(3).max(50).lowercase()

export const createUser = Joi.object().keys({
    body: Joi.object().keys({
        email: validEmail.required(),
        password: validPassword.required(),
        displayname: validDisplayname.required(),
        username: validUsername.required()
    })
})

export const getUser = Joi.object().keys({
    params: Joi.object().keys({
        userId: Joi.string().uuid().required()
    })
})

export default {
    createUser,
    getUser
}