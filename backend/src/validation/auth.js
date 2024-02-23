import Joi from 'joi'

export const localLoginValidation = Joi.object().keys({
    body: Joi.object().keys({
        username: Joi.string(),
        email: Joi.string(),
        password: Joi.string().required()
    })
        .xor('username', 'email')
})