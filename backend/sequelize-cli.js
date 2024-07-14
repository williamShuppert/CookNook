import './src/config/env.js'
import fs from 'fs'

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
    // ssl: {
    //   ca: fs.readFileSync('../certificate/supabase.crt')
    // }
  }
}

export default config