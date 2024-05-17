import React, { useState, useEffect } from 'react'
import Banner from '../../../Common/Banner/Banner'
import { Button, Grid } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton }  from '@mui/material';
import { Paper, Alert } from '@mui/material';

import axiosClient from '../../../../axios-client';

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

const SelectField = ({label, onChange=() => null, options=[]}) => {

  const [value, setValue] = useState('1')

  return (
    <div className='customSelect'>
      <label>{label}*</label>
      <select value={value} onChange={(e) => onChange(e.target.value, ()=>true, setValue)}>
        {options.map(option => (
          <option key={option.label} value={option.value}>{option.label}</option>
        ))}
      </select>
      <span className='customArrow'></span>
    </div>
  )
}

const TextField = ({label, placeholder, onChange, incomplete=null}) => {

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
        className={incomplete ? 'markAsIncomplete' : ''}
        value={value}
        onChange={(e) => {
          onChange(e.target.value, setErr, setValue)
        }} 
        type="text" 
        placeholder={incomplete ? `Rellena el campo ${incomplete}` : placeholder}/>
    </div>
  )
}

const TextArea = ({label, placeholder, onChange=()=>null, incomplete=null}) => {

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
      <textarea className={incomplete ? 'markAsIncomplete' : ''} value={value} onChange={(e) => onChange(e.target.value, setErr, setValue)} placeholder={incomplete ? `Rellena el campo ${incomplete}` : placeholder} rows={4} cols={50}></textarea>
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
    categoria: '1',
    marca: '1',
    medida: '1',
    metodo: 'peps',
    cantidad: '',
    almacen: '1',
    comprobante: 'null',
    fechaVencimiento: 'null',
    descripcionEstacional: 'null',
    fechaInicioEstacional: 'null',
    fechaFinalEstacional: 'null'
  })
  const [listaNuevosProductos, setListaNuevosProductos] = useState([])
  const [markAsIncomplete, setMarkAsIncomplete] =  useState([])

  const [categorias, setCategorias] = useState([])
  const [marcas, setMarcas] = useState([])
  const [unidades_medida, setUnidadesMedida] = useState([])
  const [almacenes, setAlmacenes] = useState([])


  const handleAgregarNuevoProducto = (producto) => {

    const required = ['nombre', 'descripcion', 'categoria', 'marca', 'medida', 'precio', 'cantidad', 'minimo', 'maximo', 'metodo', 'almacen']
    const incompletes = []
    // Validaciones para registrar un nuevo producto
    for (let require of required) {
      if (!producto[require] || producto[require] === '') {
        incompletes.push(require)
      }
    }
   
    if (incompletes.length > 0) {
      setMarkAsIncomplete(incompletes)
      return
    } else {
      setMarkAsIncomplete([])
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

  // Retribuir datos seleccionables de la BD

  
  const getItems = () => {
    axiosClient.get('/seleccionables')
      .then(({data}) => {
        setCategorias(data.categorias.map(categoria=> {
          return {
            label: categoria.nombre,
            value: categoria.categoriaId
          }
        }))
        setMarcas(data.marcas.map(marca=> {
          return {
            label: marca.nombre,
            value: marca.marcaId
          }
        }))
        setUnidadesMedida(data.unidades_medida.map(medida=> {
          return {
            label: medida.nombre,
            value: medida.unidadMedidaId
          }
        }))
        setAlmacenes(data.almacenes.map(almacen=> {
          return {
            label: almacen.nombre,
            value: almacen.almacenId
          }
        }))

      })
      .catch((e) => {
        console.log('Error en la respuesta: '+e);
      }) 
  }

  useEffect(() => {
    getItems()
  },[])

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
                <TextField incomplete={markAsIncomplete.find(l=>l=='nombre')} onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'nombre', validateAPI.name)} label='Nombre del producto' placeholder='Nombre #'/>

                <TextArea incomplete={markAsIncomplete.find(l=>l=='descripcion')} onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'descripcion', validateAPI.everything)} label='Descripcion del producto' placeholder='Descripcion #'/>

                <SelectField options={categorias} onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'categoria', (n)=>true)} label='Categoria del producto'/>

                <SelectField options={marcas} onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'marca', (n)=>true)} label='Marca del producto'/>
                
                <SelectField options={unidades_medida} onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'medida', (n)=>true)} label='Medida del producto'/>
                
                <TextField onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'codigoBarra', validateAPI.numeric, 'Maximo de digitos: 15. Solo digitos permitidos')} label='Codigo de barra' placeholder='**********'/>

                <TextField incomplete={markAsIncomplete.find(l=>l=='precio')} onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'precio', validateAPI.positiveReal)} label='Precio de venta' placeholder='C$'/>  

                <TextField incomplete={markAsIncomplete.find(l=>l=='cantidad')} onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'cantidad', validateAPI.positiveIntegerOrZero)} label='Cantidad inicial de stock' placeholder='Cantidad'/>  

                <TextField incomplete={markAsIncomplete.find(l=>l=='minimo')} onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'minimo', validateAPI.positiveIntegerOrZero)} label='Minimo de existencias' placeholder='Minimo'/>                

                <TextField incomplete={markAsIncomplete.find(l=>l=='maximo')} onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'maximo', validateAPI.positiveIntegerOrZero)} label='Maximo de existencias' placeholder='Maximo'/>                

              </div>

              <div className='secondaryData'>
                <SelectField options={[{label: 'peps', value: 'peps'}, {label: 'ueps', value: 'ueps'}]} onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'metodo', (n)=>true)} label='Metodo de inventario'/>
    
                <SelectField options={almacenes} onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'almacen', (n)=>true)} label='Almacen a guardar'/>
              </div>

              <div className='secondaryData'>
                <SelectField options={[{label: 'no', value: 'f'}, {label: 'si', value: 't'}]} onChange={(value, setErr, setValue)=>handleChangeNuevoProducto(value, setErr, setValue, 'perecedero', (n)=>true)}label='Es perecedero?'/>
    
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