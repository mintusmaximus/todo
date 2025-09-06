import { pool } from '../helper/db.js'

const sendSignUp = async (email, password) => {
    return await pool.query('INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *',
        [email, password]
    )
}

const sendSignIn = async (email) => {
    return await pool.query('SELECT * FROM account WHERE email= ($1) ', [email])
}

export { sendSignUp, sendSignIn }