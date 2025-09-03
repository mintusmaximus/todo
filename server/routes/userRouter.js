import { pool } from "../helper/db.js";
import { Router } from "express";
import { compare, hash } from "bcrypt";
import  jwt  from 'jsonwebtoken';

// take sign out of jwt into its own thing
const { sign } = jwt

const router = Router()

// create signup endpoint with password hashing and sql query
router.post('/signup', (req, res, next) => {
    // req body: {"user":{"email": "x", "password": ""}}
    const { user } = req.body // take the request body from {user:{...}} into req.body 
    // on empty submit throw error
    if (!user || !user.email || !user.password) {
        // create new error object with message 
        const error = new Error('Email and password are required')
        // pass error to express error handler middleware
        return next (error)
    }

    // bcrypt password hash
    hash(user.password, 10, (err, hashedPassword) => {
        if (err) return next (err) // throw error to express
        
        // this sql query returns:  id, int
        //                          email, char
        //                          password, char
        pool.query('INSERT INTO account (email, password) VALUES ($1,$2) RETURNING *',
            [user.email, hashedPassword], // insert request.body.email and password into placeholders

            // handle error
            (err, result) => {
                if (err) {
                    return next (err)
                }
                // on successful post, send id and email to post-er
                res.status(201).json({id: result.rows[0].id, email: user.email})
            })
    })
})

router.post('/signin', (req, res, next) => {
    const { user } = req.body
    if (!user || !user.email || !user.password) {
        const error = new Error('Email and password are required')
        error.status = 400
        return next (error)
    }
    // query returns id, email and password
    pool.query('SELECT * FROM account WHERE email = ($1)', 
        [user.email], 
        // console.log('SELECT * FROM account WHERE email = ', user.email),
        (err,result) => {
        if (err) return next (err)
        // if query returns nothing
        if (result.rows.length === 0) {
            const error = new Error("user not found")
            error.status = 404
            return next(error)
        }
        // dbuser is json object of {id: x, email: x, password: x}
        const dbUser=result.rows[0]
        // console.log(dbUser)

        // user is request body and dbuser is sql query return values
        compare(user.password, dbUser.password, (err, isMatch) => {
            if (err) return next (err)
            
            if (!isMatch) {
                const error = new Error("Invalid password")
                error.status = 401
                return next (error)
            }
        })

        const token = sign({ user: dbUser.email }, process.env.JWT_SECRET_KEY)
        res.status(200).json({
            id: dbUser.id,
            email: dbUser.email,
            token
        })
    })
})

export default router






