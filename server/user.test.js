import { expect } from "chai"
import { describe, it, before } from "mocha"
import { insertTestUser } from "./helper/test.js"

describe("Testing user management", () => {
    const user = {email: "foo2@test.com", password: "barpassword"}

    before(() => {
        insertTestUser(user)
    })

    it("should sign up", async () => {
        const newUser = {email: "foo", password: "bar"}
        
        /* response from post:
        {
            "id": 10,
            "email": "asdfasdfa"
        }
        */
        const response = await fetch("http://localhost:3001/user/signup", {
            method:"post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({user: newUser})
        })
        const responseData = await response.json()
        expect(response.status).to.equal(201)
        expect(responseData).to.include.all.keys(["id", "email"]) // these get returned from sql query and set as status
        expect(responseData.email).to.equal(newUser.email)
    })

    it("should sign in", async () => {
        const respone = await fetch("http://localhost:3001/user/signin", {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ user })
        })
        const data = await respone.json()
        expect(respone.status).to.equal(200)
        expect(data).to.include.all.keys(["id", "email", "token"])
        expect(data.email).to.equal(user.email)
    })

    
})
