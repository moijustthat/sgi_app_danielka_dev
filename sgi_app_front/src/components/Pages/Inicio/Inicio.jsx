import {useState} from 'react'
import './Inicio.css'
import Cards from './Cards/Cards'
import Table from './Table/Table'
import RightSide from './RightSide/RightSide'

const Inicio = () => {
    return (
        <div className='InicioContainer'>
        <div className='Inicio'>
            <h1>Inicio</h1>
            <Cards />
            <Table />
        </div>
        <RightSide />
        </div>

    )
}

export default Inicio