import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../context/useUser.js";

import React from 'react'

export default function ProtectedRoute() {
    const { user } = useUser()
    if (!user || !user.token) return <Navigate to="/signin" replace />
    return (<Outlet/>)
}

