import './config/env.js'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import helmetOptions from './config/helmet.js'
import { useDB } from './middleware/mysql2.js'
import { errorConverter, errorHandler } from './middleware/errors.js'
import { catchAsync } from './utils/catchAsync.js'
import usersRoute from './routes/users.js'

const port = process.env.PORT
const app = express()

app.disable('x-powered-by')
app.use(helmet(helmetOptions))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.json({message: 'hello world'}))
app.get('/db', useDB(), catchAsync(async (req, res) => {
    res.json({queryResult: await req.db.query('SELECT 1+1 AS ans', true) })
}))

app.use('/users', usersRoute)

app.use(errorConverter)
app.use(errorHandler)

app.listen(port, () => console.log(`listening on port ${port}`))