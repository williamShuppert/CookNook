import './config/passport.js'
import express from 'express'
import helmet from 'helmet'
import xss from 'xss-clean'
import cors from 'cors'
import { errorConverter, errorHandler } from './middleware/errors.js'
import docsRouter from './routes/docs.js'
import usersRouter from './routes/user.js'
import authRouter from './routes/auth.js'
import passport from 'passport'

const app = express()

app.use(helmet())
app.use(xss())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())

if (process.env.NODE_ENV == 'dev') {
    app.get('/', (req, res) => res.json({message: 'hello world'}))
    app.get('/error', (req, res) => {throw new Error('this is an error')})
    app.use('/docs', docsRouter)
}

app.use('/users', usersRouter)
app.use('/auth', authRouter)

app.use((req, res, next) => res.sendStatus(404))

app.use(errorConverter)
app.use(errorHandler)

export default app