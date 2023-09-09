import express from 'express'
import { errorConverter, errorHandler } from './middleware/errors.js'
import usersRoute from './routes/users.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV == 'development') {
    app.get('/', (req, res) => res.json({message: 'hello world'}))
    app.get('/error', (req, res) => {throw new Error('this is an error')})
}

app.use('/users', usersRoute)

app.use((req, res, next) => res.sendStatus(404))

app.use(errorConverter)
app.use(errorHandler)

export default app