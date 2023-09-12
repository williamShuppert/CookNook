import Joi from 'joi'

export const localLogin = Joi.object().keys({
    body: Joi.object().keys({
        password: Joi.string().required(),
        username: Joi.string().required()
    })
})