import pkg from 'pg'
import dotenv from 'dotenv'

const environment = process.env.NODE_ENV || 'development'
// console.log("Environment:", process.env.NODE_ENV)

dotenv.config()

const { Pool } = pkg // object destructuring, take pkg.Pool into Pool and create new instances via const x = Pool

const openDB = () => {
    // create new instance of pkg.Pool and return
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        // see ./package.json
        database: environment === "development" ? process.env.DB_NAME : process.env.TEST_DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    })
    return pool
}

const pool = openDB()

export { pool }

