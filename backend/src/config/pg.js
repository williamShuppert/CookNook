import pg from 'pg'
const { Pool } = pg

export const pool = new Pool()

export const ensureConnection = async () => {
    await pool.query('SELECT 1 + 1 AS ans')
    console.log('Database connection successful')
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