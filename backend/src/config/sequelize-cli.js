import '../../env.config.js'

const baseConfig = {
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_NAME,
  "host": "127.0.0.1",
  "dialect": "mysql"
}

export default {
  "dev": {...baseConfig},
  "test": {...baseConfig},
  "prod": {...baseConfig}
}
