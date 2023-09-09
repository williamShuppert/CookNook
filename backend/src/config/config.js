import dotenv from 'dotenv'
import Joi from 'joi'

if (!process.env.NODE_ENV)
    process.env.NODE_ENV = 'development'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const envVarsSchema = Joi.object().keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'testing').required(),
    PORT: Joi.number().default(3000),
    DB_NAME: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
}).unknown()

const { error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error)
    throw new Error(`Config validation error: ${error.message}`)

console.log(`Current Environment: ${process.env.NODE_ENV}`)
console.log(`Current Database: ${process.env.DB_NAME}`)