import React, { useState, useEffect, useContext } from 'react'
import Banner from '../../../Common/Banner/Banner'
import { Button, Grid } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton }  from '@mui/material';
import { Paper, Alert } from '@mui/material';
import { v4 } from 'uuid'
import { NotificationContext } from '../../../Notifications/NotificationProvider';
import { UilExclamationTriangle } from '@iconscout/react-unicons'
import { Avatar } from '@mui/material'
import { useStateContext } from '../../../../Contexts/ContextProvider';
import * as DateHandler from '../../../../utils/DatesHelper'
import axiosClient from '../../../../axios-client';
import CircularProgressLoading from '../../../Common/CircularProgess/CircularProgress';
import { UilPlus } from '@iconscout/react-unicons'
import { UilInfoCircle } from '@iconscout/react-unicons'
import { UilTrashAlt } from '@iconscout/react-unicons'
import { UilEdit } from '@iconscout/react-unicons'
import { UilEye } from '@iconscout/react-unicons'
import { UilExpandAlt } from '@iconscout/react-unicons'

import { UilCompressAlt } from '@iconscout/react-unicons'

import validateAPI from '../../../../utils/textValidation'

import './AddProducto.css'
import TableListaProductos from '../../../Common/Table/Table'
import Resume from '../../../Common/Resume/Resume.';



const formatTable = (table, categorias, marcas, unidadesMedida, almacenes, estados, tipos) => {
  const formatedTable = []
  for (let row of table) {
    let copyRow = {...row}
    // Dar un valor descriptivo al usuario para los valores establecidos con los campos select
    try {
      copyRow.categoria = categorias.find(categoria => String(categoria.value) === String(copyRow.categoria)).label
      copyRow.marca = marcas.find(marca => String(marca.value) === String(copyRow.marca)).label
      copyRow.medida = unidadesMedida.find(medida => String(medida.value) === String(copyRow.medida)).label
      copyRow.almacen = almacenes.find(almacen => String(almacen.value) === String(copyRow.almacen)).label
      copyRow.activo = estados.find(activo => String(activo.value) === String(copyRow.activo)).label
      copyRow.perecedero = tipos.find(tipo => String(tipo.value) === String(copyRow.perecedero)).label
    } catch (e) {
      alert('Error en: '+e)
    }


    // Dar un valor mas literal a las columnas nulas
    let columns = Object.keys(copyRow)
    for (let column of columns) {
      if (copyRow[column] === 'null') {
        copyRow[column] = ''
      }
    }

    if (copyRow.img != '') {
      copyRow.img = <Avatar alt={'producto'} src={`data:image/jpeg;base64,${copyRow.img}`}/> 
    }

    formatedTable.push(copyRow)
  }
  return formatedTable
}

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


const ImgField = ({label, placeholder, onChange, incomplete=null}) => {

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
        type="file"
        onChange={(e) => {
          onChange(e.target.files[0], setErr)
        }} 
       
        placeholder={incomplete ? `Rellena el campo ${incomplete}` : placeholder}/>
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
  id: 1,
  img: '',
  nombre: '',
  codigoBarra: '',
  descripcion: '',
  categoria: 'empty',
  marca: 'empty',
  medida: 'empty',
  precio: '',
  cantidad: '',
  minimo: '',
  maximo: '',
  activo: 't',
  almacen: 'empty',
  metodo: 'peps',
  perecedero: 'f',
  fechaVencimiento: '',
  descripcionEstacional: '',
  fechaInicioEstacional: '',
  fechaFinalEstacional: '',
  comprobante: ''
}


const AddProducto = ({setOpen, refresh, categorias, marcas, unidades_medida, almacenes}) => {
  const [nuevoProducto, setNuevoProducto] = useState(init)
  const [listaNuevosProductos, setListaNuevosProductos] = useState([])
  const [markAsIncomplete, setMarkAsIncomplete] =  useState([])
  const [listFullSize, setListFullSize] = useState(false)

  const dispatch = useContext(NotificationContext)

  const [edit, setEdit] = useState(null)

  const generalActions = [
    {
        icon: <UilTrashAlt />,
        label: 'Eliminar producto/s',
        condition: (numSelected) => numSelected > 0,
        action: (selected) => {
          console.log(selected)
          setListaNuevosProductos(prev => {
            const reducedList = []
            for (let row of prev) {
              if (selected.findIndex(bye=> bye == row.id) !== -1) continue
              reducedList.push(row)
            }
            return reducedList
          })
        }
    },
    {
        icon: <UilInfoCircle  />,
        label: 'Info',
        condition: () => true,
        action: () => alert('Mostrar Ayuda')
    },
    {
      icon: !listFullSize ? <UilExpandAlt   /> : <UilCompressAlt />,
      label: !listFullSize ? 'Expandir' : 'Comprimir',
      condition: () => true,
      action: () => setListFullSize(!listFullSize)
    }
]

  const actions = [
    {
        label: 'Editar',
        icon: <UilEdit />,
        action: (id) => setEdit(id)
    }
  ]

  const abstractTable = (table) => {
    const columns = ['id', 'nombre', 'codigoBarra', 'cantidad', 'minimo', 'maximo']
    const abstractedTable = []
    if (table.length == 0) return table
    for (let row of table) { // recorrer todas las filas de la tabla
      const abstractedRow = Object.create({})
      for (let column of columns) {
        abstractedRow[column] = row[column]
      }
      abstractedTable.push(abstractedRow)
    }
    console.log(abstractedTable);
    return abstractedTable
  }

  const handleAgregarNuevoProducto = (producto) => {

    let logicError = false
    const required = ['nombre', 'descripcion', 'categoria', 'marca', 'medida', 'precio', 'cantidad', 'minimo', 'maximo', 'metodo', 'almacen']
    const incompletes = []
    // Validaciones para registrar un nuevo producto
    
    // Campos requeridos vienen vacios:
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
        logicError = true
      }
    }

    // Verificar que el codigo de barra no exista ya en la lista
    if (listaNuevosProductos.findIndex(p=> p.codigoBarra === producto.codigoBarra) !== -1) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: v4(),
          type: 'error',
          title: 'Codigo de barra existente',
          icon: <UilExclamationTriangle />,
          message: 'Verifica que el codigo de barra no exista ya en en la lista'
        }
      })
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

    
    // Condiciones validadadas(en este punto la entrada es correcta y se manejara para mandarse a la lista de nuevos productos)
    // Quitar alertas de incompletitud
    setMarkAsIncomplete([])

    // Realizar copia del producto
    const copiaProducto = {...producto}

    // Preparacion para el siguiente producto
    setNuevoProducto(prev => {
      return {
        ...init,
        id: prev.id + 1
      }
    })

    // Parsear la copia del producto al formato de datos que espera la base de datos
    copiaProducto.categoria = Number(copiaProducto.categoria)
    copiaProducto.marca = Number(copiaProducto.marca)
    copiaProducto.medida = Number(copiaProducto.medida)
    copiaProducto.almacen = Number(copiaProducto.almacen)
    copiaProducto.precio = Number(copiaProducto.precio)
    copiaProducto.cantidad = Number(copiaProducto.cantidad)
    copiaProducto.minimo = Number(copiaProducto.minimo)
    copiaProducto.maximo = Number(copiaProducto.maximo)
    
    // convertir vacios a null
    const keys = Object.keys(copiaProducto)
    for (let key of keys) {
      if (copiaProducto[key] == '') copiaProducto[key] = 'null'
    }

    // agregar producto a la lista de nuevos productos
    const copiaLista = listaNuevosProductos.slice()
    setListaNuevosProductos([copiaProducto, ...copiaLista])
  }

  const addNuevosProductos = (listaNuevosProductos) => {
    if (listaNuevosProductos.length < 1) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: v4(),
          type: 'error',
          title: 'No hay productos en la lista',
          icon: <UilExclamationTriangle />,
          message: 'Agrega nuevos productos a la lista'
        }
      })
      return
    }
    // Reparseado. Volver a estableces los tipos correctos que espera la base de datos(Medida de seguridad)
    for (let producto of listaNuevosProductos) {
      producto.categoria = Number(producto.categoria)
      producto.marca = Number(producto.marca)
      producto.medida = Number(producto.medida)
      producto.almacen = Number(producto.almacen)
      producto.precio = Number(producto.precio)
      producto.cantidad = Number(producto.cantidad)
      producto.minimo = Number(producto.minimo)
      producto.maximo = Number(producto.maximo)
    }

    //Establecer nuevos productos a la tabla de catalogo
    // Realizar peticion post
    const payload = {productos: listaNuevosProductos}
    console.log(payload)
    axiosClient.post('/productos', payload)
    .then(({data}) => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: v4(),
          type: 'success',
          title: 'Exito',
          icon: <UilExclamationTriangle />,
          message: 'Los productos fueron guardados con exito'
        }
      })
      new Promise((resolve, reject) => {
        refresh()
        resolve()
      }).then((res)=> {
        setNuevoProducto(init)
        setListaNuevosProductos([])
        setOpen(false)
      }).catch((err)=> {
        console.log(`Error al actualizar la lista de productos desde getProductos ${err}`);
      })

    })
    .catch ((error) => {
      const messageErr = error.response.data.messageError
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: v4(),
          type: 'error',
          title: 'Error',
          icon: <UilExclamationTriangle />,
          message: messageErr
        }
      })
    })
    
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
    
    if (key === 'img') {
      const file = value // Esta es la  ruta de la imagen
      const reader = new FileReader()
      
      reader.onloadend = () => {
        setNuevoProducto({
          ...nuevoProducto,
          [key]: reader.result.replace("data:", "").replace(/^.+,/, "")
        })
      }

      reader.readAsDataURL(file)

    } else {
      setNuevoProducto({
        ...nuevoProducto,
        [key]: value
      })
    }


  }




  return (

    <div className='container'>

      <div className={`glass ${listFullSize ? 'fullGlass' : 'partialGlass'}`}>

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

                <TextField value={nuevoProducto.minimo} incomplete={markAsIncomplete.find(l=>l=='minimo')} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'minimo', validateAPI.number)} label='Minimo de existencias' placeholder='Minimo'/>                

                <TextField value={nuevoProducto.maximo} incomplete={markAsIncomplete.find(l=>l=='maximo')} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'maximo', validateAPI.number)} label='Maximo de existencias' placeholder='Maximo'/>                

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

              <div className='mainData'>  
                <ImgField incomplete={markAsIncomplete.find(l=>l=='img')} onChange={(value, setErr)=>handleChangeNuevoProducto(value, setErr, 'img', validateAPI.everything)} label='Imagen del producto' placeholder='Imagen'/>                  
              </div>
        </div>
        <div className='listaNuevosProductos'>
          <TableListaProductos 
            dense={true}
            edit={edit}
            setEdit={setEdit}
            editables={[
              {label: 'nombre', type:'text', validation: (input) => [validateAPI.name2(input), `Simbolo: ${input} no valido`]},
              {label: 'codigoBarra', type:'text', validation: (input) => [validateAPI.numeric(input), `Simbolo: ${input} no valido`]},
              {label: 'descripcion', type:'text', validation: (input) => [validateAPI.name2(input), `Simbolo: ${input} no valido`]},
              {label: 'categoria', type:'select', validation: () => categorias},
              {label: 'marca', type:'select', validation: () => marcas},
              {label: 'medida', type:'select', validation: () => unidades_medida},
              {label: 'almacen', type:'select', validation: () => almacenes},
              {label: 'precio', type:'text', validation: (input) => [validateAPI.positiveReal(input), `Simbolo: ${input} no valido`]},
              {label: 'cantidad', type:'text', validation: (input) => [validateAPI.positiveIntegerOrZero(input), `Simbolo: ${input} no valido`]},
              {label: 'minimo', type:'text', validation: (input) => [validateAPI.number(input), `Simbolo: ${input} no valido`]},
              {label: 'maximo', type:'text', validation: (input) => [validateAPI.number(input), `Simbolo: ${input} no valido`]},
              {label: 'activo', type:'select', validation: () => [{value: 't', label: 'Activo'}, {value: 'f', label: 'Inactivo'}]},
              {label: 'perecedero', type:'select', validation: () => [{value: 't', label: 'Perecedero'}, {value: 'f', label: 'Persistente'}]},

            ]}
            pagination={false}
            empty='Agrega nuevos productos a la lista!!' 
            generalActions={generalActions}
            actions={actions}
            rows={formatTable(listaNuevosProductos, categorias, marcas, unidades_medida, almacenes, [{value: 't', label: 'Activo'}, {value: 'f', label: 'Inactivo'}], [{value: 't', label: 'Perecedero'}, {value: 'f', label: 'Persistente'}])}
            setRows={setListaNuevosProductos}
            footer={<Resume 
                dataSet={listaNuevosProductos}
                calcs={
                  [
                  (dataSet) => {
                    const total = dataSet.length
                    return <div style={{display: 'flex'}}>
                              <p>Nuevos productos: {total}</p> 
                            </div>
                    },

                  (dataSet) => {
                    const total = dataSet.reduce((a,b) => a + b.cantidad, 0)
                    console.log(total)
                    return  <div style={{display: 'flex'}}>
                                <p>Total de Stock: {total}</p> 
                              </div>
                  }
                
                ]
              }
            />}
          />
        </div>
        <button  onClick={() => handleAgregarNuevoProducto(nuevoProducto)} className={`btnAgregarProducto ${!listFullSize ? 'partialBtn' : 'noneBtn'}`}>Agregar a la lista</button>
        <button  onClick={() => addNuevosProductos(listaNuevosProductos)} id='agregarLista' className={`btnAgregarLista ${!listFullSize ? 'partialBtn' : 'fullBtn'}`}>Registrar Productos</button>
      </div>
   

    </div>

  )
}



export default AddProducto
