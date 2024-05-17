import React, { useState, useEffect, useContext } from 'react'
import Banner from '../../../Common/Banner/Banner'
import { Button, Grid } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton }  from '@mui/material';
import { Paper, Alert } from '@mui/material';
import { v4 } from 'uuid'
import { NotificationContext } from '../../../Notifications/NotificationProvider';
import { UilExclamationTriangle } from '@iconscout/react-unicons'
import { UilCheckCircle } from '@iconscout/react-unicons'
import { Avatar } from '@mui/material'
import { useStateContext } from '../../../../Contexts/ContextProvider';
import * as DateHandler from '../../../../utils/DatesHelper'
import axiosClient from '../../../../axios-client';

import validateAPI from '../../../../utils/textValidation'

import './AddProducto.css'
import TableListaProductos from '../../../Common/Table/Table'

const DateField = ({value, label, blocked=false, onChange=() => null}) => {

  const [err, setErr] = useState('')
  return (
    <div className='customDate'>
      <label>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value, setErr)} id='dateField' type='date' disabled={blocked}></input>
    </div>
  )
}

const SelectField = ({incomplete='', value, label, onChange=() => null, options=[]}) => {
  return (
    <div className='customSelect'>
      <label>{label}*</label>
      <select className={incomplete !== '' ? 'markAsIncomplete' : ''} value={value} onChange={(e) => onChange(e.target.value, ()=>true)}>
        <option disabled selected value='empty'>Seleccionar</option>
        {options.map(option => (
          <option key={option.label} value={option.value}>{option.label}</option>
        ))}
      </select>
      <span className='customArrow'></span>
    </div>
  )
}

const TextField = ({value, label, placeholder, onChange, incomplete=null}) => {

  const [err, setErr] = useState('')

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
          onChange(e.target.value, setErr)
        }} 
        type="text" 
        placeholder={incomplete ? `Rellena el campo ${incomplete}` : placeholder}/>
    </div>
  )
}

const TextArea = ({value, label, placeholder, onChange=()=>null, incomplete=null}) => {

  const [err, setErr] = useState('')

  return (
    <div className='textField'>
      <label>{label}*</label>
      <Alert 
        onClose={()=>setErr('')}
        sx={{
          display: err == '' ? 'none' : ''
        }} severity="error">{err}</Alert>
      <textarea className={incomplete ? 'markAsIncomplete' : ''} value={value} onChange={(e) => onChange(e.target.value, setErr)} placeholder={incomplete ? `Rellena el campo ${incomplete}` : placeholder} rows={4} cols={50}></textarea>
    </div>
  )
}

const init ={
  id: 0,
  nombre: '',
  descripcion: '',
  precio: '',
  activo: 't',
  perecedero: 't',
  codigoBarra: '',
  minimo: '',
  maximo: '',
  img: 'null',
  categoria: 'empty',
  marca: 'empty',
  medida: 'empty',
  metodo: 'peps',
  cantidad: '',
  almacen: 'empty',
  comprobante: 'null',
  fechaVencimiento: '',
  descripcionEstacional: '',
  fechaInicioEstacional: '',
  fechaFinalEstacional: ''
}


const AddProducto = ({setOpen}) => {
  const [nuevoProducto, setNuevoProducto] = useState(init)
  const [listaNuevosProductos, setListaNuevosProductos] = useState([])
  const [markAsIncomplete, setMarkAsIncomplete] =  useState([])

  const [categorias, setCategorias] = useState([])
  const [marcas, setMarcas] = useState([])
  const [unidades_medida, setUnidadesMedida] = useState([])
  const [almacenes, setAlmacenes] = useState([])

  const dispatch = useContext(NotificationContext)

  // Traer informacion necesaria de la base de datos del contexto, no de uma nueva peticion

  const handleAgregarNuevoProducto = (producto) => {

    console.log('producto:', producto)
    let logicError = false
    const required = ['nombre', 'descripcion', 'categoria', 'marca', 'medida', 'precio', 'cantidad', 'minimo', 'maximo', 'metodo', 'almacen']
    const incompletes = []
    // Validaciones para registrar un nuevo producto
    
    // Campos requeridos vacios:
    for (let require of required) {
      if (!producto[require] || producto[require] === '' || producto[require] === 'empty') {
        incompletes.push(require)
      }
    }
   
    if (incompletes.length > 0) {
      console.log(incompletes);
      setMarkAsIncomplete(incompletes)
      return
    } 

    

    // Condiciones logicas:
    if (producto.perecedero == 't' && !producto.fechaVencimiento) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: v4(),
          type: 'error',
          title: 'Producto sin fecha de vencimiento',
          icon: <UilExclamationTriangle />,
          message: 'Especifica la fecha de vencimiento de este stock'
        }
      })
      logicError = true
    }

    if (producto.perecedero == 'f' && producto.fechaVencimiento !== '') {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: v4(),
          type: 'error',
          title: 'Producto no perecedero',
          icon: <UilExclamationTriangle />,
          message: 'Si el producto no vence no ingreses una fecha de vencimiento'
        }
      })
      logicError = true
    }

    if (Number(producto.minimo) >= Number([producto.maximo])) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: v4(),
          type: 'error',
          title: 'Error en las cantidades',
          icon: <UilExclamationTriangle />,
          message: 'El minimo no puede ser mayor al maximo'
        }
      })
      logicError = true
    }

    if (producto.fechaVencimiento !== '' && producto.perecedero === 't') {
      if (DateHandler.isLesserOrEqual(producto.fechaVencimiento, DateHandler.getCurrentDate())) {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: v4(),
            type: 'error',
            title: 'Error en la fecha de vencimiento',
            icon: <UilExclamationTriangle />,
            message: 'La fecha de vencimiento no puede ser anterior al dia de hoy'
          }
        })
        logicError = true
      }
    }

    if (producto.descripcionEstacional !== '') {
      if (producto.fechaInicioEstacional == '' || producto.fechaFinalEstacional == '') {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: v4(),
            type: 'error',
            title: 'Ingresa las fechas de la temporada',
            icon: <UilExclamationTriangle />,
            message: 'Ingresa las fechas correspondientes a la temporada'
          }
        })
        logicError = true
      } else {
        if (DateHandler.isLesser(producto.fechaInicioEstacional, DateHandler.getCurrentDate())) {
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: v4(),
              type: 'error',
              title: 'Inicio de la temporada invalido',
              icon: <UilExclamationTriangle />,
              message: 'La fecha de inicio de la temporada no puede ser anterior a hoy'
            }
          })
          logicError = true
        } else if(DateHandler.isLesser(producto.fechaFinalEstacional, DateHandler.getCurrentDate())) {
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: v4(),
              type: 'error',
              title: 'Final de la temporada invalido',
              icon: <UilExclamationTriangle />,
              message: 'La fecha de final de la temporada no puede ser anterior a hoy'
            }
          })
          logicError = true
        } else if (DateHandler.isLesser(producto.fechaFinalEstacional, producto.fechaInicioEstacional)) {
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: v4(),
              type: 'error',
              title: 'Rango de fechas invalido',
              icon: <UilExclamationTriangle />,
              message: 'La fecha final de la temporada no puede ser anterior al inicio'
            }
          })
          logicError = true
        }
      }

    } else {
      if (producto.fechaInicioEstacional !== '' || producto.fechaFinalEstacional !== '') {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: v4(),
            type: 'error',
            title: 'Ingresa la descripcion de la temporada',
            icon: <UilExclamationTriangle />,
            message: 'Ingresa la descripcion de la temporada que escogiste'
          }
        })
      }
      logicError = true
    }

    /*
    if (listaNuevosProductos.some(prev => prev.codigoBarra === producto.codigoBarra)) {

    }*/

    // Warnings
    if (Number(producto.cantidad) < Number(producto.minimo)) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: v4(),
          type: 'warning',
          title: 'Stock en escazes',
          icon: <UilExclamationTriangle />,
          message: 'La cantidad que ingresaras es menor a la minima'
        }
      })
    }

    if (Number(producto.cantidad) > Number(producto.maximo)) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: v4(),
          type: 'warning',
          title: 'Stock en exceso',
          icon: <UilExclamationTriangle />,
          message: 'La cantidad que ingresaras es mayor al maximo'
        }
      })
    }



    if (logicError) return
    // Quitar alertas de incompletitud
    setMarkAsIncomplete([])
    const copiaProducto = {...producto}
    copiaProducto.id += 1
    setNuevoProducto({
      ...init,
      id: copiaProducto.id
    })
    console.log(copiaProducto);
    


  }

  const handleChangeNuevoProducto = (value, setErr, key, validate, personalized='') => {

    // Validar entrada actual
    // Validar caracter por caracter
    
    if (!validate(value)) {
      // Mostrar mensaje
      setErr(personalized!==''? personalized : `Entrada incorrecta: ${value}`)
      return
    } else {
      setErr('')
    }
    

    setNuevoProducto({
      ...nuevoProducto,
      [key]: value
    })
  }

  // Retribuir datos seleccionables de la BD  
  const getItems = () => {
    axiosClient.get('/seleccionables')
      .then(({data}) => {
        setCategorias(data.categorias.map((categoria, index)=> {
          return {
            label: categoria.nombre,
            value: categoria.categoriaId
          }
        }))
        setMarcas(data.marcas.map((marca,index)=> {
          return {
            label: marca.nombre,
            value: marca.marcaId
          }
        }))
        setUnidadesMedida(data.unidades_medida.map((medida, index)=> {
          return {
            label: medida.nombre,
            value: medida.unidadMedidaId
          }
        }))
        setAlmacenes(data.almacenes.map((almacen, index)=> {
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
                <TextField value={nuevoProducto.nombre} incomplete={markAsIncomplete.find(l=>l=='nombre')} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'nombre', validateAPI.name)} label='Nombre del producto' placeholder='Nombre #'/>

                <TextArea  value={nuevoProducto.descripcion} incomplete={markAsIncomplete.find(l=>l=='descripcion')} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'descripcion', validateAPI.everything)} label='Descripcion del producto' placeholder='Descripcion #'/>

                <SelectField incomplete={markAsIncomplete.find(l=>l=='categoria')} value={nuevoProducto.categoria} options={categorias} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'categoria', (n)=>true)} label='Categoria del producto'/>

                <SelectField incomplete={markAsIncomplete.find(l=>l=='marca')} value={nuevoProducto.marca} options={marcas} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'marca', (n)=>true)} label='Marca del producto'/>
                
                <SelectField incomplete={markAsIncomplete.find(l=>l=='medida')} value={nuevoProducto.medida} options={unidades_medida} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'medida', (n)=>true)} label='Medida del producto'/>
                
                <TextField value={nuevoProducto.codigoBarra} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'codigoBarra', validateAPI.numeric, 'Maximo de digitos: 15. Solo digitos permitidos')} label='Codigo de barra' placeholder='**********'/>

                <TextField value={nuevoProducto.precio} incomplete={markAsIncomplete.find(l=>l=='precio')} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'precio', validateAPI.positiveReal)} label='Precio de venta' placeholder='C$'/>  

                <TextField value={nuevoProducto.cantidad} incomplete={markAsIncomplete.find(l=>l=='cantidad')} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'cantidad', validateAPI.positiveIntegerOrZero)} label='Cantidad inicial de stock' placeholder='Cantidad'/>  

                <TextField value={nuevoProducto.minimo} incomplete={markAsIncomplete.find(l=>l=='minimo')} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'minimo', validateAPI.positiveIntegerOrZero)} label='Minimo de existencias' placeholder='Minimo'/>                

                <TextField value={nuevoProducto.maximo} incomplete={markAsIncomplete.find(l=>l=='maximo')} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'maximo', validateAPI.positiveIntegerOrZero)} label='Maximo de existencias' placeholder='Maximo'/>                

              </div>

              <div className='secondaryData'>
                <SelectField value={nuevoProducto.metodo} options={[{label: 'peps', value: 'peps'}, {label: 'ueps', value: 'ueps'}]} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'metodo', (n)=>true)} label='Metodo de inventario'/>
    
                <SelectField incomplete={markAsIncomplete.find(l=>l=='almacen')} value={nuevoProducto.almacen} options={almacenes} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'almacen', (n)=>true)} label='Almacen a guardar'/>
              </div>

              <div className='secondaryData'>
                <SelectField value={nuevoProducto.perecedero} options={[{label: 'no', value: 'f'}, {label: 'si', value: 't'}]} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'perecedero', (n)=>true)}label='Es perecedero?'/>
    
                <DateField
                  value={nuevoProducto.fechaVencimiento}
                  onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'fechaVencimiento', (n)=>true)} 
                  label='Fecha de vencimiento'/>
              </div>

              <div className='mainData'>  
                <TextArea value={nuevoProducto.descripcionEstacional} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'descripcionEstacional', validateAPI.name)} label='Descripcion de temporada' placeholder='Exp: Stock reservado a ventas de verano entre...'/>  
              </div>

              <div className='secondaryData'>
                <DateField value={nuevoProducto.fechaInicioEstacional} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'fechaInicioEstacional', (n)=>true)} label='Fecha inicio de temporada'/>
    
                <DateField value={nuevoProducto.fechaFinalEstacional} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'fechaFinalEstacional', (n)=>true)} label='Fecha final de temporada'/>
              </div>
            </div>



        <div className='listaNuevosProductos'>
          <TableListaProductos 
            pagination={false}
            empty='Agrega nuevos productos a la lista!!' 
            rows={listaNuevosProductos}
          />
        </div>
        <button  onClick={() => handleAgregarNuevoProducto(nuevoProducto)} className='btnAgregarProducto'>Agregar a la lista</button>
        <button id='agregarLista' className='btnAgregarLista'>Registrar Productos</button>
      </div>
   

    </div>

  )
}



export default AddProducto
