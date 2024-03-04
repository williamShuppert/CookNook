import Joi from 'joi'

export const createRecipeValidation = Joi.object().keys({
    body: Joi.object().keys({
        name: Joi.string().max(100).required(),
        description: Joi.string(),
        ingredients: Joi.array().items(Joi.string()).required(),
        instructions: Joi.array().items(Joi.string()).required()
    }),
    query: Joi.object().keys({
        id: Joi.string().guid({ version: 'uuidv4' })
    })
})

export const updateRecipeValidation = Joi.object().keys({
    body: Joi.object().keys({
        name: Joi.string().max(100),
        description: Joi.string(),
        ingredients: Joi.array().items(Joi.string()),
        instructions: Joi.array().items(Joi.string()).required()
    }),
    query: Joi.object().keys({
        id: Joi.string().guid({ version: 'uuidv4' })
    })
})

export const deleteRecipeValidation = Joi.object().keys({
    param: Joi.object().keys({
        id: Joi.string().guid({ version: 'uuidv4' }).required()
    })
})