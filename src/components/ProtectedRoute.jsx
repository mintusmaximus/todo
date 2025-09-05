import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../context/useUser.js"; // using global usercontext

import React from 'react'


export default function ProtectedRoute() {
    const { user } = useUser() // reading context and setting to user obj

    // checking if context has valid items, replace replaces the current entry in the history stack
    if (!user || !user.token) return <Navigate to="/signin" replace />
    

    // if we pass the user check, we render the outlet component, which in this case is the '/' path, <App /> component,
    // protectedroute is the parent, and outlet renders the child (app).
    return (<Outlet/>) 
}

