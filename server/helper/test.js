import fs from 'fs'
import path from 'path'
import { pool } from './db.js'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

const __dirname = import.meta.dirname

// when running tests, NODE_ENV is set to "test" which then uses a shorthand if in pool export to use test db instead of dev/prod
const initializeTestDB = () => {
    const sql = fs.readFileSync(path.resolve(__dirname, '../sql/TestTable.sql'), 'utf8')

    // console.log(sql) // double checked file read and sql query, works

    pool.query(sql, (err) => {
        if (err) {
            console.error("Error initializing database: " + err)
        } else {
            console.log("Test database initialized successfully")
        }
    })
}

const insertTestUser = (user) => {
    hash(user.password, 10, (err, hashedPassword) => {
        if (err) {
            console.error("Error hashing testpassword: " + err)
            return
        }
        pool.query('INSERT INTO account (email, password) VALUES ($1, $2)',
            [user.email, hashedPassword],
            (err, result) => {
                if (err) {
                    console.error("Error inserting test user: ", err)
                } else {
                    console.log("Test user inserted successfully")
                }
            })
    })
}

const getToken = (email) => {
    return jwt.sign({email}, process.env.JWT_SECRET_KEY)
}

export { initializeTestDB, insertTestUser, getToken }