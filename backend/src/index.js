import '../config/env.config.js'
import './config/mysql2.js'
import app from './app.js'
import sequelize from './config/sequelize.js'

const port = process.env.PORT

try {
    await sequelize.authenticate();
    app.listen(port, () => console.log(`listening on port ${port}`))
    console.log('Connection has been established successfully.')
} catch (error) {
    console.error('Unable to connect to the database:', error)
}