import './src/config/env.js'

const NODE_ENV = process.env.NODE_ENV
const config = {}
config[NODE_ENV] = {
  "username": process.env.PGUSER,
  "password": process.env.PGPASSWORD,
  "database": process.env.PGDATABASE,
  "host": process.env.PGHOST,
  "dialect": "postgres"
}

export default config