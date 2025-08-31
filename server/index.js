import express from 'express'
import cors from 'cors'
import pkg from 'pg'


const port = 3001
const { Pool } = pkg // object destructuring, take pkg.Pool into Pool and create new instances via const x = Pool
const app = express()
app.use(cors())
// allows clients to send json data
app.use(express.json())
// a llows clients to pass parameters in url (?=something etc.)
app.use(express.urlencoded({extended: false}))

const openDB = () => {
    // create new instance of pkg.Pool and return
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'todo',
        password: 'admin',
        port: 5432
    })
    return pool
}

app.get('/', (req, res) => {
    // open db connection 
    const pool = openDB()
    // send query to db
    pool.query('SELECT * FROM task', (err, result) => {
        // handle error and return
        if (err) {
            return res.status(500).json({error: err.message})
        }
        // if no error, send result
        res.status(200).json(result.rows)
    })
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})

// .post(path     , callback   => function)
app.post('/create', (req, res) => {
    const pool = openDB()
    const { task } = req.body // deconstruct request body from request object into task
    // so request body could be 
    /*  
        task: {
            description: "Do thing"
        } 
    */
    
    if (!task) { // essentially no request body
        console.log("task is required")
        return res.status(400).json({error: 'task is required'})
    }


    // insert statement into database todo task description, $1 is placeholder which is [task.description], 
    // 'returning *' gives back everything inserted into the query after table has been changed.
    /* request body example:
    {
        "task": {
            "description": "buy milk"
        }
    }
    */
    //  .query(sqlquery, placeholderparams, callbackfunction with params (err, result) )
    pool.query(
        'insert into task (description) values ($1) returning *', 
        // now we take description: "thing" from task:{} <- json array of tasks to be pushed to backend
        [task.description],
        // callback function
        (err, result) => {
            if (err) {
                return res.status(500).json({error: err.message})
            }
        // on success, send 201 code and array of resulting ids and descriptions back to request sender (postman example):
        /*
        {
            "id": 9,
            "description": "buy milk"
        } 
        */
            res.status(201).json({id: result.rows[0].id, description: task.description})
        })
})



app.delete('/delete/:id', (req, res) => {
    const pool = openDB()
    const { id } = req.params // take todo task id from parameter queries

    console.log(`Deleting task with id:${id}`)
    pool.query('delete from task WHERE id = $1', // sql query with placeholder $1, could also do 'returning *' here to see what gets deleted
    [id], // insert id into placeholder
    // callback function with error, sql result 
    (err, result) => {
        if (err) {
            console.error(err.message)
            return res.status(500).json({error: err.message})
        }
        if (result.rowCount === 0) { // sql query result on wrong id is "DELETE 0 \n\n Query returned successfully in 27 msec.", successful is same but DELETE 1,
                                     // result.rowcount is the number of rows affected by query so if deletion doesnt go through the error makes sense
            return res.status(404).json({error: 'task not found'}) // returns error to request sender
        }
    return res.status(200).json({id:id}) // successful delete request, this returns {"id": "9"} for example 
    })
})