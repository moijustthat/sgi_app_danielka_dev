import React from 'react'
import './NotFound.css'
import Advertencia from './advertencia.png'

const NotFound = () => {
    return (
        <div className='NotFound'> 
            <img src={Advertencia} alt="Error" width="200" height="200" />
            <h2>Error 404</h2>
            <p>La pagina que buscaste no existe</p>
            <a href="/">Vuelva al inicio</a>
        </div>
    )
}

export default NotFound