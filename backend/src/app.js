import express from 'express'
import helmet from 'helmet'
import xss from 'xss-clean'
import cors from 'cors'
import { errorConverter, errorHandler } from './middleware/errors.js'
import docsRouter from './routes/docs.js'
import usersRoute from './routes/user.js'

const app = express()

app.use(helmet())
app.use(xss())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV == 'development') {
    app.get('/', (req, res) => res.json({message: 'hello world'}))
    app.get('/error', (req, res) => {throw new Error('this is an error')})
    app.use('/docs', docsRouter)
}

app.use('/users', usersRoute)

app.use((req, res, next) => res.sendStatus(404))

app.use(errorConverter)
app.use(errorHandler)

export default app