import { pool } from '../config/pg.js'

export const useDB = () => async (req, res, next) => {
    try {
        const client = await pool.connect()
        req.db = client
        res.on('finish', () => client.release())
        next()
    } catch (err) {
        next(err)
    }
}