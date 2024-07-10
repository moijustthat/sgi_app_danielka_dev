import {useState} from 'react'
import './Inicio.css'
import Cards from './Cards/Cards'
import Table from './Table/Table'
import RightSide from './RightSide/RightSide'

import {useState} from 'react'
import './Inicio.css'
import Cards from './Cards/Cards'
import Table from './Table/Table'
import RightSide from './RightSide/RightSide'
import Grid from '@mui/material/Grid';

const Inicio = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <h1>Inicio</h1>
            </Grid>
            <Grid item xs={12}>
                <Cards />
            </Grid>
            <Grid item xs={12}>
                <Table />
            </Grid>
        </Grid>
    )
}

export default Inicio

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