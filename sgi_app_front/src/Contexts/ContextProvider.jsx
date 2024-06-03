import { createContext, useContext, useState } from "react"
import { usersInfo } from '../Data/EmpleadosInfo'
import axiosClient from "../axios-client"

import { isJSON } from "../utils/JsonHelper"

const StateContext = createContext({
    permisos: null,
    user: null,
    token: null,
    productos: null,
    setPermisos: () => {},
    setUser: () => {},
    setToken: () => {},
    getUser: () => null,
    getPermisos: () => {},
    setProductos: () => {},
})

export const ContextProvider = ({children}) => {

    const [user, _setUser] = useState(localStorage.getItem('USER_INFO'))
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'))
    const [productos, setProductos] = useState([])
    const [permisos, _setPermisos] = useState(localStorage.getItem('USER_PERMISOS'))

    const getPermisos = () => {
        console.log(isJSON(permisos))
        if (permisos) {
            try {
                return JSON.parse(permisos)
            } catch(e) {
                return permisos
            }
        }
        return 'No hay permisos en la sesion'
    }

    const setPermisos = (permisos) => {
        _setPermisos(permisos)
        if (permisos) {
            localStorage.setItem('USER_PERMISOS', JSON.stringify(permisos))
        } else {
            localStorage.removeItem('USER_PERMISOS')
        }
    }

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
            permisos,
            user,
            token,
            productos,
            setPermisos,
            setUser,
            setToken,
            setProductos,
            getUser,
            getPermisos
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)