import { useState } from "react";
import { UserContext } from "./UserContext.js";
import axios from 'axios'



export default function UserProvider({children}) {
    const userFromStorage = sessionStorage.getItem("user")
    const [user, setUser] = useState(userFromStorage ? JSON.parse(userFromStorage) : {email: ", password: "})
    
    const signUp = async () => {
        const headers = {headers: {"Content-Type": "application/json"}}
        await axios.post(`${import.meta.env.VITE_API_URL}/user/signup`, JSON.stringify({user: user}), headers)
        setUser({email: ", password: "})
    }

    const signIn = async (email, password) => {
        const headers = {headers: {"Content-Type": "application/json"}}
        const respone = await axios.post(`${import.meta.env.VITE_API_URL}/user/signin`, JSON.stringify({user: user}), headers)
        setUser(respone.data)
        sessionStorage.setItem('user', JSON.stringify(respone.data))
    }


    return (
        <UserContext.Provider value={{user, setUser, signUp, signIn}}>
            {children}
        </UserContext.Provider>
    )
}
