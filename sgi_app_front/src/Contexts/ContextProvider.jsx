import { createContext, useContext, useState } from "react"

import { usersInfo } from '../Data/EmpleadosInfo'

const StateContext = createContext({
    user: null,
    token: null,
    productos: null,
    setUser: () => {},
    setToken: () => {},
    getUser: () => null,
    setProductos: () => {},
})

export const ContextProvider = ({children}) => {

    const [user, _setUser] = useState(localStorage.getItem('USER_INFO'))
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'))
    const [productos, setProductos] = useState([])

    const getUser = () => {
        if (user) return JSON.parse(user)
        return 'No hay usuario en la sesion'
    }

    const setUser = (user) => {
        _setUser(user)
        if (user) {
            localStorage.setItem('USER_INFO', user)
        } else {
            localStorage.removeItem('USER_INFO')
        }
    }    

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token)
        } else {
            localStorage.removeItem('ACCESS_TOKEN')
            localStorage.removeItem('USER_INFO')
        }
    }

    return (
        <StateContext.Provider value={{
            user,
            token,
            productos,
            setUser,
            setToken,
            setProductos,
            getUser,
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)