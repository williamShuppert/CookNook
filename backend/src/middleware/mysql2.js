import { pool, useConnection } from '../config/mysql2.js'

export const useDB = () => async (req, res, next) => {
    const conn = await pool.getConnection()
    req.db = useConnection(conn)
    res.on('finish', () => conn.release())
    next()
}