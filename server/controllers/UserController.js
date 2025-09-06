import { ApiError } from "../helper/ApiError.js"
import { sendSignIn, sendSignUp } from '../models/Users.js'
import { compare, hash } from "bcrypt";
import  jwt  from 'jsonwebtoken';
const { sign } = jwt



const postSignUp = async (req, res, next) => {
    const { user } = req.body
    try { 
        if (!user || !user.email || !user.password) {
            return next(new ApiError('User email and password required', 400))
        }
        const hashedPassword = await hash(user.password, 10) // using promise based hashing for async await
        const result = await sendSignUp(user.email, hashedPassword)        
        res.status(201).json({
            id: result.rows[0].id, 
            email: user.email
        })
    } catch  (error) {
        return next (error)
    }
}

const postSignIn = async (req, res, next) => {
    const { user } = req.body

    try {
        if (!user || !user.email || !user.password) {
            return next(new ApiError("User email and password required", 400))
        }

        const result = await sendSignIn(user.email)
        if (result.rows.length === 0) {
            return next(new ApiError("user not found", 404))
        }

        const dbUser=result.rows[0]
        compare(user.password, dbUser.password, (err, isMatch) => {
            if (err) return next (err)
  
            if (!isMatch) {
                return next(new ApiError("invalid password"), 401)
            }
        })


        const token = sign({ user: dbUser.email }, process.env.JWT_SECRET_KEY)
        res.status(200).json({
            id: dbUser.id,
            email: dbUser.email,
            token
        })

    } catch (error) {
        throw next (error)
    }
}


export { postSignUp, postSignIn }

