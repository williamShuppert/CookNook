import pg from 'pg'
const { Pool } = pg

export const pool = process.env.DB_URL
    ? new Pool({ connectionString: process.env.DB_URL })
    : new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: process.env.NODE_ENV == 'prod'
    })

export const ensureConnection = async () => {
    await pool.query('SELECT 1 + 1 AS ans')
        .then(_ => console.log('Database connection successful'))
        .catch(err => {
            console.log(err)
            throw err
        })
}

export const transaction = (client, func) => {
    client.query('BEGIN')
        .then(_ => func())
        .then(_ => client.query('COMMIT'))
        .catch(err => {
            client.query('ROLLBACK')
            throw err
        })
}