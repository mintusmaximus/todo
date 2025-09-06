import { useState } from "react";
import { UserContext } from "./UserContext.js"; // using user context§
import axios from 'axios'



// children is the RouterProvider object
/**
 * UserProvider is the function that sets UserContext, taking in the browserRouter as props/children
 * Sets {user, setUser, signUp, signIn} to context
 * user is react usestate for {email: ", password: "}
 * setUser is the usestate setter, that checks if user already exists in sessionstorage, default is {email: ", password: "}
 * signUp posts the /user/signup endpoint
 * signIn posts the /user/signin endpoint 
 */
export default function UserProvider({children}) {

    // checking if user is in storage (gets saved to sessionStorage on login)
    const userFromStorage = sessionStorage.getItem("user")

    // react usestate for holding user info, if userFromStorage exists, JSON parse it, else set {email: ", password: "} as initial state
    const [user, setUser] = useState(userFromStorage ? JSON.parse(userFromStorage) : {email: ", password: "})
    console.log({email: ", password: "})
    

    // create signUp HTTP request handler
    const signUp = async () => {
        // set header values
        const headers = {headers: {"Content-Type": "application/json"}}

        // POST to signup with {user:{email:x,password:x}}, these values are from useState
        await axios.post(`${import.meta.env.VITE_API_URL}/user/signup`, JSON.stringify({user: user}), headers)

        setUser({email: ", password: "}) // set values to useState
    }

    
    // create signUp HTTP request handler
    const signIn = async (email, password) => {
        const headers = {headers: {"Content-Type": "application/json"}} //set headers

        // POST request to signin endpoint with {user: {email, pwd}} JSON body
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/signin`, JSON.stringify({user: user}), headers) //"user: " is the curly bracket that holds the info, the user after "user:" is useState, containing email and password
        setUser(response.data) // setting user context of {id, email, token}
        sessionStorage.setItem('user', JSON.stringify(response.data)) // the response of POSTing the /signin endpoint is {id, email, token}, here we save {user: {response}}
        
        //debug 
        console.log('SignIn response data user', JSON.stringify(response.data)) // {"id":x,"email":"x","token":"x"}
        console.log("react usestate user from SignIn endpoint:" + user) // this is just [object object]
    }


    return (
        // finally setting context for user
        <UserContext.Provider value={{user, setUser, signUp, signIn}}>
            {children} {/* this is where context gets passed to all children: '/','/signin','/signup' */ }
        </UserContext.Provider>
    )
}
