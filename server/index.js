import express from 'express'
import cors from 'cors'

// import all endpoints from separate file for cleaner code
import todoRouter from './routes/todoRouter.js'
import userRouter from './routes/userRouter.js'

const port = process.env.PORT

const app = express()
app.use(cors())
// allows clients to send json data
app.use(express.json())
// allows clients to pass parameters in url (?=something etc.)
app.use(express.urlencoded({extended: false}))

// set / directory to use todo router
app.use('/', todoRouter)
app.use('/user', userRouter) // create /user/ and assign any routes in userroutes to it (/user/signup)
app.listen(port)

// error handling middleware (4 args), when we ues next(err) it goes here
app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    res.status(statusCode).json({
        error: {
            message: err.message,
            status: statusCode
        }
    })
})
