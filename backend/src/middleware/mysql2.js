import { pool, useConnection } from '../config/mysql2.js'

export const useDB = () => async (req, res, next) => {
    try {
        const conn = await pool.getConnection()
        req.db = useConnection(conn)
        res.on('finish', () => conn.release())
        next()
    } catch (err) {
        next(err)
    }
}