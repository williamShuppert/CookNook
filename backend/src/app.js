import './config/env.js'
import './config/passport.js'
import express from 'express'
import https from 'https'
import helmet from 'helmet'
import cors from 'cors'
import helmetOptions from './config/helmet.js'
import cookieParser from 'cookie-parser'
import { useDB } from './middleware/mysql2.js'
import { errorConverter, errorHandler } from './middleware/errors.js'
import { catchAsync } from './utils/catchAsync.js'
import usersRoute from './routes/users.js'
import authRoute from './routes/auth.js'
import passport from 'passport'
import { corsOptions } from './config/cors.js'
import { httpsOptions } from './config/https.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const port = process.env.PORT
const app = express()

// Middleware
app.disable('x-powered-by')
app.use(helmet(helmetOptions))
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())

// Test routes
app.get('/api', (req, res) => res.json({message: 'hello world'}))
app.get('/api/db', useDB(), catchAsync(async (req, res) => {
    res.json({queryResult: await req.db.query('SELECT 1+1 AS ans', true) })
}))

// Routes
app.use('/api/users', usersRoute)
app.use('/api/auth', authRoute)

// Serve static react app
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
app.use(express.static(path.join(__dirname, '../../frontend/dist')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html')))

// Error handling
app.use(errorConverter)
app.use(errorHandler)

https.createServer(httpsOptions, app)
    .listen(port, () => console.log(`listening on port ${port}`))