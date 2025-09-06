import { ApiError } from "../helper/ApiError.js"
import { selectAllTasks, insertTask, deleteTask } from "../models/Tasks.js"

const getTasks = async (req, res, next) => {
    console.log("Calling getTasks ")
    try {
        const result = await selectAllTasks()
        return res.status(200).json(result.rows || [])
    } catch (error) {
        return next (error)
    }
}

const postTask = async (req, res, next) => {
    const { task } = req.body
    console.log("Task to create: " + task.description)
    try {
        if (!task || !task.description || !task.description.trim().length === 0) { // if not valid input, set proper html error codes and throw error to express and user
            return next(new ApiError('Task description is required', 400)) // new class just does the below 3 lines of code
            /*const error = new Error('Task description is required')
            error.status = 400
            return next (error)*/
        }
        const result = await insertTask(task.description) // call the sql query in Tasks.js

        // sql query returns id and description so set those to the result.
        return res.status(201).json({id: result.rows[0].id, description: result.rows[0].description})
    } catch (error) {
        return next (error)
    } 
}

// add auth here?
const removeTask = async (req, res, next) => {
    const { id } = req.params
    console.log("Deleting task with id: " + id)

    try {
        if (!id) {
            return next(new ApiError('Task id required'), 400)
        }

        const result = await deleteTask(id)

        if (result.rowCount === 0) {
            return next(new ApiError('Task not found'), 404)
        }

        return res.status(200).json({id: id})

    } catch (error) {
        return next (error)
    }

}

export { getTasks, postTask, removeTask }