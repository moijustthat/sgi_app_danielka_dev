import React from 'react'
import Banner from '../../../Common/Banner/Banner'
import { Button, Grid } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton }  from '@mui/material';
import { Paper } from '@mui/material';

import './AddProducto.css'

const DateField = ({label, blocked=false}) => {

  return (
    <div className='customDate'>
      <label>{label}</label>
      <input id='dateField' type='date' disabled={blocked}></input>
    </div>
  )
}

const SelectField = ({label}) => {

  return (
    <div className='customSelect'>
      <label>{label}*</label>
      <select>
        <option value='1'>
          test 1
        </option>
        <option value='2'>
          test 2
        </option>
        <option value='3'>
          test 3
        </option>
      </select>
      <span className='customArrow'></span>
    </div>
  )
}

const TextField = ({label, placeholder}) => {

  return (
    <div className='textField'>
      <label>{label}*</label>
      <input type="text" placeholder={placeholder}/>
    </div>
  )
}

const TextArea = ({label, placeholder}) => {

  return (
    <div className='textField'>
      <label>{label}*</label>
      <textarea  placeholder={placeholder} rows={4} cols={50}></textarea>
    </div>
  )
}

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
              <div className='mainData'>
                <TextField label='Nombre del producto' placeholder='Nombre #'/>

                <TextArea label='Descripcion del producto' placeholder='Descripcion #'/>

                <SelectField label='Categoria del producto'/>

                <SelectField label='Marca del producto'/>
                
                <SelectField label='Medida del producto'/>
                
                <TextField label='Codigo de barra' placeholder='**********'/>

                <TextField label='Precio de venta' placeholder='C$'/>  

                <TextField label='Cantidad inicial de stock' placeholder='Cantidad'/>  

                <TextField label='Minimo de existencias' placeholder='Minimo'/>                

                <TextField label='Maximo de existencias' placeholder='Maximo'/>                

              </div>

              <div className='secondaryData'>
                <SelectField label='Metodo de inventario'/>
    
                <SelectField label='Almacen a guardar'/>
              </div>

              <div className='secondaryData'>
                <SelectField label='Es perecedero?'/>
    
                <DateField label='Fecha de vencimiento'/>
              </div>

              <div className='mainData'>  
                <TextArea label='Descripcion de temporada' placeholder='Exp: Stock reservado a ventas de verano entre...'/>  
              </div>

              <div className='secondaryData'>
                <DateField label='Fecha inicio de temporada'/>
    
                <DateField label='Fecha final de temporada'/>
              </div>
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