import { pool } from '../config/mysql2.js'

export const db = () => async (req, res, next) => {
    const conn = await pool.getConnection()

    req.db = {
        conn, 

        sproc: async (sprocName, values, expectOne) => {
            const res = (await conn.execute(`call ${sprocName}(${values.map(()=>'?').join(',')})`, values))[0][0]
            return expectOne ? res[0] : res
        },
        
        query: async (query, expectOne) => {
            const res = (await conn.execute(query))[0]
            return expectOne ? res[0] : res;
        },
        
        execute: async (query, values, expectOne) => {
            const res = (await conn.execute(query, values))[0]
            return expectOne ? res[0] : res;
        },

        transaction: async (func) => {
            await conn.beginTransaction()
            try {
                const res = await func()
                await conn.commit()
                return res
            } catch (error) {
                await conn.rollback()
                throw error
            }
        }
    }

    res.on('finish', () => conn.release())
    next()
}