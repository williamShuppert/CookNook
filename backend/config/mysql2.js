import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

/**
 * Acquires a connection from the connection pool, executes a provided function, 
 * and then releases the connection back to the pool.
 *
 * @param {Function} func - The function to execute.
 * It should accept two arguments: a connection helper object and a mysql2 connection.
 * @returns {Promise<any>} - A Promise that resolves to the result of the provided function.
 */
export const usePool = async (func) => {
    const connection = await pool.getConnection()
    try {
        const helper = {
            /**
             * Execute a SQL query with optional parameterized values and retrieve the result.
             * @param {String} query - The SQL query to execute.
             * @param {String[]} values - An array of parameterized values to bind to the query (optional).
             * @param {Boolean} expectOne - Indicates whether to expect a single result (true) or multiple results (false).
             * @returns {Promise<any>} - A Promise that resolves to the query result or an array of results.
             * */
            execute: async (query, values, expectOne) => {
                const res = (await connection.execute(query, values))[0]
                return expectOne ? res[0] : res;
            },
            /**
             * Executes a SQL query and retrieve the result.
             * @param {String} query - The SQL query to execute.
             * @param {Boolean} expectOne - Indicates whether to expect a single result (true) or multiple results (false).
             * @returns {Promise<any>} - A Promise that resolves to the query result or an array of results.
             * */
            query: async (query, expectOne) => {
                const res = (await connection.execute(query))[0]
                return expectOne ? res[0] : res;
            },
            /**
             * Executes a SQL stored procedure and retrieves the result.
             * @param {String} name - The SQL query to execute.
             * @param {String[]} values - An array of parameterized values to bind to the query (optional).
             * @param {Boolean} expectOne - Indicates whether to expect a single result (true) or multiple results (false).
             * @returns {Promise<any>} - A Promise that resolves to the query result or an array of results.
             * */
            sproc: async (name, values, expectOne) => {
                const res = (await connection.execute(`call ${name}(${values.map(()=>'?').join(',')})`, values))[0][0]
                return expectOne ? res[0] : res
            },
            /**
             * Starts a database transaction, executes a provided function within the transaction,
             * and handles the transaction accordingly.
             *
             * @param {Function} func - The function to execute within the transaction. It should
             * accept two arguments: a database helper object and a database connection.
             * @returns {Promise<any>} - A Promise that resolves to the result of the provided function.
             */
            transaction: async (func) => {
                await connection.beginTransaction()
                try {
                    const res = await func(helper, connection)
                    await connection.commit()
                    return res
                } catch (error) {
                    await connection.rollback()
                    throw error
                }
            }
        }
        return await func(helper, connection)
    } catch (error) {
        throw error
    } finally {
        await connection.release()
    }
}

// Test database connection
await usePool(async db => {
    const testQuery = 'SELECT 1+1 AS ans'
    await db.query(testQuery)
    console.log(`Testing DB connection: ${testQuery}\n  - Connection successful`)
})