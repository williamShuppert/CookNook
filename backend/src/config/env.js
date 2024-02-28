import dotenv from 'dotenv'
import Joi from 'joi'
import fs from 'fs'

const NODE_ENV = process.env.NODE_ENV
if (!NODE_ENV)
    throw new Error('NODE_ENV needs to be set')

if (!['dev', 'stage', 'prod'].includes(NODE_ENV))
    throw new Error("NODE_ENV must be one of the following: 'dev', 'stage', 'prod'")

const validateEnvFile = () => {
    let envFileName = `.env.${NODE_ENV}`
    if (!fs.existsSync(envFileName)) {
        if (!fs.existsSync('.env'))
            throw new Error(`Missing ${envFileName} file`)

        envFileName = '.env' // Default to .env file
    }

    dotenv.config({ path: envFileName })

    const envVarsSchema = Joi.object().keys({
        NODE_ENV: Joi.string().valid('dev', 'stage', 'prod').required(),
        CORS_ORIGIN: Joi.string().allow(''),
        PORT: Joi.number().default(3000),
        PGHOST: Joi.string().required(),
        PGUSER: Joi.string().required(),
        PGDATABASE: Joi.string().required(),
        PGPASSWORD: Joi.string().required(),
        PGPORT: Joi.number().required(),
        ACCESS_JWT_SECRET: Joi.string().min(64).required(),
        REFRESH_JWT_SECRET: Joi.string().min(64).required(),
        OAUTH_SUCCESS_REDIRECT_URL: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CLIENT_CALLBACK_URL: Joi.string().required()
    }).unknown()

    const { error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env, {abortEarly: false})

    if (error)
        throw new Error(
            "Config validation error\n" +
            `The ${envFileName} file fails validation:\n` +
            error.details.map(detail => ' - ' + detail.message).join('\n') +
            '\n'
        )

    console.log('Environment Config: (located at: /config/env.config.js)')
    console.log(` - Current Environment: "${NODE_ENV}"`)
    console.log(` - Current Database: "${process.env.PGDATABASE}"`)
}

if (process.env.PORT) // Return if env is already configured
    console.warn('Environment was already configured. No env file will be used.')
else
    validateEnvFile()