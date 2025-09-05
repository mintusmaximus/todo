import { useContext } from "react";
import { UserContext } from "./UserContext.js"; // using global context

/** 
 * Returns an empty react context via createContext(), unless context written by something else
 */ 
export const useUser = () => {
    // usecontext is a hook that allows to read and "subscribe to" context from component
    // usecontext(somecontext)
    return useContext(UserContext)
}
