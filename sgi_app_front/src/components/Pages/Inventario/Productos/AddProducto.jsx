import React from 'react'
import Banner from '../../../Common/Banner/Banner'
import { Button, Grid } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton }  from '@mui/material';

import './AddProducto.css'

const AddProducto = ({setOpen}) => {
  return (
    <div className='container'>
      <div className='glass'>
       
        <div className='formProducto'>
          <div className='exit'>
              <IconButton  onClick={() => setOpen(false)}>
                  <ArrowBackIcon />
              </IconButton>
            </div>

          <div className='form'>
            <h1>Formulario con scroll</h1>
            <h1>Formulario con scroll</h1>
            <h1>Formulario con scroll</h1>
            <h1>Formulario con scroll</h1>
            <h1>Formulario con scroll</h1>
            <h1>Formulario con scroll</h1>
            <h1>Formulario con scroll</h1>
            <h1>Formulario con scroll</h1>
            <h1>Formulario con scroll</h1>
            <h1>Formulario con scroll</h1>
            <h1>Formulario con scroll</h1>
            <h1>Formulario con scroll</h1>
            <h1>Formulario con scroll</h1>
            <h1>Formulario con scroll</h1>
          </div>

          <div className='btnAgregarProducto'>
            <h3>Agregar a la lista</h3>
          </div>


        </div>

        <div className='nuevosProductos'>
          <div className='listaNuevosProductos'>
            <h3>Nuevo Producto con scroll obvio</h3>
            <h3>Nuevo Producto</h3>
            <h3>Nuevo Producto</h3>
            <h3>Nuevo Producto</h3>
            <h3>Nuevo Producto</h3>
            <h3>Nuevo Producto</h3>
            <h3>Nuevo Producto</h3>
            <h3>Nuevo Producto</h3>
            <h3>Nuevo Producto</h3>
            <h3>Nuevo Producto</h3>
            <h3>Nuevo Producto</h3>
          </div>

          <div className='btnAgregarLista'>
            <h3>Agregar nuevos prodctos a la BD</h3>
          </div>
        </div>
      </div>
    </div>

  )
}

export default AddProducto