import { pool } from '../config/pg.js'

export const useDB = () => async (req, res, next) => {
    try {
        const client = await pool.connect()

        req.db = client
        req.db.dynamicQuery = (query, values) => {
            // allow question marks to be used rather than pg's positional params ('$1' can now just be '?')
            let valueIndex = 1
            return client.query(
                query.replace(/\?/g, _ => `$${valueIndex++}`),
                values)
        }

        res.on('finish', () => client.release())
        next()
    } catch (err) {
        next(err)
    }
}