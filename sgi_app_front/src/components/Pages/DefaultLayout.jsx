import React from 'react'
import { useStateContext } from '../../Contexts/ContextProvider'
import { Navigate, Outlet } from 'react-router-dom'

const DefaultLayout = () => {

    const {token} = useStateContext()

    if (token) return <Navigate to='/' />

    return (
        <div>
            <Outlet />
        </div>
    )
}

export default DefaultLayout