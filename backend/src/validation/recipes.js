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

export const searchRecipeValidation = Joi.object().keys({
    query: Joi.object().keys({
        name: Joi.string().default(''),
        author: Joi.string().default(''),
        tag: Joi.array().items(Joi.number().min(1)).unique().single().default([]),
        tagMatch: Joi.string().valid('any', 'all').default('any'),
        order: Joi.array().unique().items(
            Joi.string().valid('new','bookmarks','rating','time')
        ).single().default(['rating', 'bookmarks']),
        page: Joi.number().empty('').min(0).default(0),
        limit: Joi.number().empty('').min(1).default(25),
    })
})