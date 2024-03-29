import dotenv from 'dotenv'
import Joi from 'joi'
import fs from 'fs'

const NODE_ENV = process.env.NODE_ENV
if (!NODE_ENV)
    throw new Error('NODE_ENV needs to be set')

if (!['dev', 'stage', 'prod'].includes(NODE_ENV))
    throw new Error("NODE_ENV must be one of the following: 'dev', 'stage', 'prod'")

const validateEnvVariables = () => {
    const envVarsSchema = Joi.object().keys({
        NODE_ENV: Joi.string().valid('dev', 'stage', 'prod').required(),
        CORS_ORIGIN: Joi.string().allow(''),
        PORT: Joi.number().default(3000),
        DB_URL: Joi.string(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.number(),
        DB_NAME: Joi.string(),
        DB_USER: Joi.string(),
        DB_PASSWORD: Joi.string(),
        ACCESS_JWT_SECRET: Joi.string().min(64).required(),
        REFRESH_JWT_SECRET: Joi.string().min(64).required(),
        OAUTH_SUCCESS_REDIRECT_URL: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CLIENT_CALLBACK_URL: Joi.string().required(),
        GOOGLE_STATE_JWT_SECRET: Joi.string().min(64).required()
    }).unknown()
        .xor('DB_HOST', 'DB_URL').xor('DB_PORT', 'DB_URL')
        .xor('DB_NAME', 'DB_URL').xor('DB_USER', 'DB_URL')
        .xor('DB_PASSWORD', 'DB_URL')

    const { error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env, {abortEarly: false})

    if (error)
        throw new Error(
            "Environment variables validation error\n" +
            `Fails validation(s):\n` +
            error.details.map(detail => ' - ' + detail.message).join('\n') +
            '\n'
        )

    console.log('Environment Config: (located at: /config/env.config.js)')
    console.log(` - Current Environment: "${NODE_ENV}"`)
    console.log(` - Current Database: "${process.env.DB_NAME}"`)
}

if (!process.env.PORT) { // env variables are not yet configured
    let envFileName = `.env.${NODE_ENV}`
    if (!fs.existsSync(envFileName))
        throw new Error(`Missing ${envFileName} file`)

    dotenv.config({ path: envFileName })
    console.log(`Validating environment variables from the file "${envFileName}"`)
} else {
    console.log(`Validating pre-configured environment variables`)
}

validateEnvVariables()