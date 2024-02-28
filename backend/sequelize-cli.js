import './src/config/env.js'

console.log(process.env.DB_HOST)

const NODE_ENV = process.env.NODE_ENV
const config = {}
config[NODE_ENV] = {
  "host": process.env.DB_HOST,
  "port": process.env.DB_PORT,
  "database": process.env.DB_NAME,
  "username": process.env.DB_USER,
  "password": process.env.DB_PASSWORD,
  "dialect": "postgres",
  "dialectOptions": {
    ssl: process.env.NODE_ENV == 'prod'
  }
}

export default config