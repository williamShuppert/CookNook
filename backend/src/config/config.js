import dotenv from 'dotenv'
import Joi from 'joi'

dotenv.config()

const envVarsSchema = Joi.object().keys({
    NODE_ENV: Joi.string().valid('production', 'development').required(),
    PORT: Joi.number().default(3000),
    DB_NAME: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
}).unknown()

const { error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error)
    throw new Error(`Config validation error: ${error.message}`)