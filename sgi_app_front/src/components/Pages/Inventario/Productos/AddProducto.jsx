import React, { useState } from 'react'
import Banner from '../../../Common/Banner/Banner'
import { Button, Grid } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton }  from '@mui/material';
import { Paper, Alert } from '@mui/material';

import validateAPI from '../../../../utils/textValidation'

import './AddProducto.css'
import TableListaProductos from '../../../Common/Table/Table'

const DateField = ({label, blocked=false, onChange=() => null}) => {

  const [err, setErr] = useState('')
  const [value, setValue] = useState('')
  return (
    <div className='customDate'>
      <label>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value, setErr, setValue)} id='dateField' type='date' disabled={blocked}></input>
    </div>
  )
}

const SelectField = ({label, onChange=() => null}) => {

  const [value, setValue] = useState('')

  return (
    <div className='customSelect'>
      <label>{label}*</label>
      <select value={value} onChange={(e) => onChange(e.target.value, ()=>true, setValue)}>
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

const TextField = ({label, placeholder, onChange}) => {

  const [err, setErr] = useState('')
  const [value, setValue] = useState('')

  return (
    <div className='textField'>
      <label>{label}*</label>
      <Alert 
        onClose={()=>setErr('')}
        sx={{
          display: err == '' ? 'none' : ''
        }} severity="error">{err}</Alert>
      <input 
        value={value}
        onChange={(e) => {
          onChange(e.target.value, setErr, setValue)
        }} 
        type="text" placeholder={placeholder}/>
    </div>
  )
}

const TextArea = ({label, placeholder, onChange=()=>null}) => {

  const [err, setErr] = useState('')
  const [value, setValue] = useState('')

  return (
    <div className='textField'>
      <label>{label}*</label>
      <Alert 
        onClose={()=>setErr('')}
        sx={{
          display: err == '' ? 'none' : ''
        }} severity="error">{err}</Alert>
      <textarea value={value} onChange={(e) => onChange(e.target.value, setErr, setValue)} placeholder={placeholder} rows={4} cols={50}></textarea>
    </div>
  )
}


const AddProducto = ({setOpen}) => {
  const [nuevoProducto, setNuevoProducto] = useState({
    id: 0,
    nombre: '',
    descripcion: '',
    precio: '',
    activo: 't',
    perecedero: 'f',
    codigoBarra: '',
    minimo: '',
    maximo: '',
    img: 'null',
    categoria: '',
    marca: '',
    medida: '',
    metodo: '',
    cantidad: '',
    almacen: '',
    comprobante: 'null',
    fechaVencimiento: 'null',
    descripcionEstacional: 'null',
    fechaInicioEstacional: 'null',
    fechaFinalEstacional: 'null'
  })
  const [listaNuevosProductos, setListaNuevosProductos] = useState([])


  const handleAgregarNuevoProducto = (producto) => {
    
    console.log(producto);

    const required = ['nombre', 'descripcion', 'categoria', 'marca', 'medida', 'precio', 'cantidad', 'minimo', 'maximo', 'metodo', 'almacen']
    // Validaciones para registrar un nuevo producto
    for (let require of required) {
      if (!producto[require] || producto[require] === '') {
        alert('Campos incompletos')
        return
      }
    }

    // Ingresar producto a la lista



    const copiaLista = listaNuevosProductos.slice()
    const copiaProducto = producto
    copiaProducto.id += 1
    
    // validar que no ingrese el mismo producto(caso doble click)
    if (copiaLista.length > 0 && copiaProducto.id == copiaLista.slice().pop().id) {
      alert('No puedes ingresar el mismo producto  dos veces :(')
      return 
    }

    copiaLista.push(copiaProducto)
    setListaNuevosProductos(copiaLista)
  }

  const handleChangeNuevoProducto = (value, setErr, setValue, key, validate, personalized='') => {

    // Validar entrada actual
    // Validar caracter por caracter
    
    if (!validate(value)) {
      // Mostrar mensaje
      setErr(personalized!==''? personalized : `Entrada incorrecta: ${value}`)
      return
    } else {
      setErr('')
    }
    
    setValue(value)
    setNuevoProducto({
      ...nuevoProducto,
      [key]: value
    })
  }

  return (

    <div className='container'>
      <div className='glass'>
      <div className='exit'>
              <IconButton  onClick={() => setOpen(false)}>
                  <ArrowBackIcon />
              </IconButton>
            </div>
       



            <div className='form'>
              <div className='mainData'>
                <TextField onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'nombre', validateAPI.name)} label='Nombre del producto' placeholder='Nombre #'/>

                <TextArea onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'descripcion', validateAPI.everything)} label='Descripcion del producto' placeholder='Descripcion #'/>

                <SelectField onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'categoria', (n)=>true)} label='Categoria del producto'/>

                <SelectField onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'marca', (n)=>true)} label='Marca del producto'/>
                
                <SelectField onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'medida', (n)=>true)} label='Medida del producto'/>
                
                <TextField onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'codigoBarra', validateAPI.numeric, 'Maximo de digitos: 15. Solo digitos permitidos')} label='Codigo de barra' placeholder='**********'/>

                <TextField onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'precio', validateAPI.positiveReal)} label='Precio de venta' placeholder='C$'/>  

                <TextField onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'cantidad', validateAPI.number)} label='Cantidad inicial de stock' placeholder='Cantidad'/>  

                <TextField onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'minimo', validateAPI.number)} label='Minimo de existencias' placeholder='Minimo'/>                

                <TextField onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'maximo', validateAPI.number)} label='Maximo de existencias' placeholder='Maximo'/>                

              </div>

              <div className='secondaryData'>
                <SelectField onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'metodo', (n)=>true)} label='Metodo de inventario'/>
    
                <SelectField onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'almacen', (n)=>true)} label='Almacen a guardar'/>
              </div>

              <div className='secondaryData'>
                <SelectField  onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'perecedero', (n)=>true)}label='Es perecedero?'/>
    
                <DateField
                  onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'fechaVencimiento', (n)=>true)} 
                  label='Fecha de vencimiento'/>
              </div>

              <div className='mainData'>  
                <TextArea onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'descripcionEstacional', validateAPI.name)} label='Descripcion de temporada' placeholder='Exp: Stock reservado a ventas de verano entre...'/>  
              </div>

              <div className='secondaryData'>
                <DateField onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'fechaInicioEstacional', (n)=>true)} label='Fecha inicio de temporada'/>
    
                <DateField onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'fechaFinalEstacional', (n)=>true)} label='Fecha final de temporada'/>
              </div>
            </div>



        <div className='listaNuevosProductos'>
          <TableListaProductos 
            pagination={false}
            empty='Agrega nuevos productos a la lista!!' 
            rows={listaNuevosProductos}
          />
        </div>

        <div onClick={() => handleAgregarNuevoProducto(nuevoProducto)} className='btnAgregarProducto'>
            <h3>Agregar a la lista</h3>
          </div>

          <div  id='agregarLista' className='btnAgregarLista'>
            <h3>Registrar Productos</h3>
          </div>

      </div>
   

    </div>

  )
}



export default AddProducto