import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

export const useConnection = (conn) => ({
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
})