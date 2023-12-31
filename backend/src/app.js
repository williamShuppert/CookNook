import './config/passport.js'
import express from 'express'
import helmet from 'helmet'
import xss from 'xss-clean'
import cors from 'cors'
import helmetOptions from './config/helmet.js'
import { errorConverter, errorHandler } from './middleware/errors.js'
import testRouter from './routes/test.route.js'
import docsRouter from './routes/docs.route.js'
import usersRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import passport from 'passport'

const app = express()

app.use(helmet(helmetOptions))
app.use(xss())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())

if (process.env.NODE_ENV === 'test')
    app.use('/tests', testRouter)

if (process.env.NODE_ENV === 'dev')
    app.use('/docs', docsRouter)

app.get('/', (req, res) => res.json({message: 'hello world'}))
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use((req, res) => res.sendStatus(404))

app.use(errorConverter)
app.use(errorHandler)

export default app