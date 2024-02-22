import './src/config/env.js'

const NODE_ENV = process.env.NODE_ENV
const config = {}
config[NODE_ENV] = {
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_NAME,
  "host": "127.0.0.1",
  "dialect": "mysql"
}

export default config