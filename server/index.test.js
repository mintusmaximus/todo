import { expect } from "chai"
import { describe, it } from "mocha"

describe("Testing basic database functionality", () => {
    var id // placeholder id for delete task later
    it("Should get all tasks", async () => {
        const response = await fetch("http://localhost:3001")
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an("array").that.is.not.empty
        expect(data[0]).to.include.all.keys(["id","description"])
    })

    it("Should create a new task", async () => {
        /*
        POSTing a new task is done with json body:
        {
            "task": {
                "description": "bro need som milk"
            }
        }
        */
        //create the task itself with "description": "something"
        const newTask = { description: "Test task"}

        // create a post response to create endpoint with {"task":{"description": "info"}}
        const response = await fetch("http://localhost:3001/create", {
            method: "post",
            // set post header type to json
            headers: { "Content-Type": "application/json"},
            // wrap description in task curly brackets 
            body: JSON.stringify({task: newTask})
        })
        // wait for server response and save everything to a data json object
        const data = await response.json()
        /*
        backend response format:
        {
            "id": 18,
            "description": "created new task"
        }
        */
        // successful post responds with 201 
        expect(response.status).to.equal(201)
        // response responds with id: xx and description: test so check if those keys exist
        expect(data).to.include.all.keys(["id","description"])
        // match the sent description to received description from post response
        expect(data.description).to.equal(newTask.description)
        id = data.id // saving the test task id for later use (delete test)
        console.log("created task with id:", id) // double checking id 
    })

    it("Should delete test task", async () => {
        // created task with id: 23
        // ✔ Should create a new task (47ms)
        // http://localhost:3001/delete/23
        // ✔ Should delete test task

        // console.log(`http://localhost:3001/delete/${id}`)

        const response = await fetch(`http://localhost:3001/delete/${id}`, {
            method: "delete"
        })
        /*
        successful delete request response:
        {
            "id": "18"
        }
        */
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.include.all.keys("id")
    })

    it("Should not create a task without a description", async () => {
        const response = await fetch("http://localhost:3001/create", {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({task: null})
        })
        // /create endpoint request response with null task ({task:{description: null}}):
        /*
        {
            "error": "null value in column \"description\" of relation \"task\" violates not-null constraint"
        }
        */
        // note: posting to /create endpoint with no data or invalid data prints a unexpected token syntax error instead (is not valid json)
        const data = await response.json()
        expect(response.status).to.equal(400)
        expect(data).to.include.all.keys("error")
        //     "error": "null value in column \"description\" of relation \"task\" violates not-null constraint"
    })
})
