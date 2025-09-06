// import db connection from separate file
import { Router } from 'express'
import { getTasks, postTask, removeTask } from '../controllers/TaskController.js'

const router = Router()

router.get('/', getTasks)
router.post('/create', postTask)
router.delete('/delete/:id', removeTask)

export default router



//// OLD CODE BEFORE MVC REFACTORING

// router.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`)
// })

// router.get('/', (req, res, next) => {
//     // open db connection 
//     // const pool = openDB()
//     // send query to db connection, now coming from its own file and not recreated every time
//     pool.query('SELECT * FROM task', (err, result) => {
//         // handle error and return
//         if (err) {
//             // next jumps to error handling middleware (in index.js)
//             return next (err)
//         }
//         // if no error, send result
//         res.status(200).json(result.rows || [])
//     })
// })


// //    .post(path, middleware function, callback => function body)

// router.post('/create', auth, (req, res, next) => {
//     const { task } = req.body // deconstruct request body from request object into task
//     // so request body could be 
//     /*  
//         task: {
//             description: "Do thing"
//         } 
//     */
    
//     if (!task) { // essentially no request body
//         console.log("task is required")
//         return res.status(400).json({error: 'task is required'})
//     }


//     // insert statement into database todo task description, $1 is placeholder which is [task.description], 
//     // 'returning *' gives back everything inserted into the query after table has been changed.
//     /* request body example:
//     {
//         "task": {
//             "description": "buy milk"
//         }
//     }
//     */
//     //  .query(sqlquery, placeholderparams, callbackfunction with params (err, result) )
//     pool.query(
//         'insert into task (description) values ($1) returning *', 
//         // now we take description: "thing" from task:{} <- json array of tasks to be pushed to backend
//         [task.description],
//         // callback function
//         (err, result) => {
//             if (err) {
//                 return next (err)
//             }
//         // on success, send 201 code and array of resulting ids and descriptions back to request sender (postman example):
//         /*
//         {
//             "id": 9,
//             "description": "buy milk"
//         } 
//         */
//             res.status(201).json({id: result.rows[0].id, description: task.description})
//         })
// })



// router.delete('/delete/:id', auth, (req, res,  next) => {
//     const { id } = req.params // take todo task id from parameter queries

//     // console.log(`Deleting task with id:${id}`)
//     pool.query('delete from task WHERE id = $1', // sql query with placeholder $1, could also do 'returning *' here to see what gets deleted
//     [id], // insert id into placeholder
//     // callback function with error, sql result 
//     (err, result) => {
//         if (err) {
//             return next (err)
//             // return res.status(500).json({error: err.message})
//         }
//         if (result.rowCount === 0) { // sql query result on wrong id is "DELETE 0 \n\n Query returned successfully in 27 msec.", successful is same but DELETE 1,
//             const error = new Error('Task not found')// result.rowcount is the number of rows affected by query so if deletion doesnt go through the error makes sense
//             error.status = 404
//             return next (error)
//         }
//     return res.status(200).json({id:id}) // successful delete request, this returns {"id": "9"} for example 
//     })
// })