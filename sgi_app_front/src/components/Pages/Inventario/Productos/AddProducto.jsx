import React, { useState, useEffect, useContext, useCallback } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Divider, IconButton }  from '@mui/material';
import { Alert } from '@mui/material';
import { v4 } from 'uuid'
import { NotificationContext } from '../../../Notifications/NotificationProvider';
import { UilExclamationTriangle } from '@iconscout/react-unicons'
import { Avatar } from '@mui/material'
import * as DateHandler from '../../../../utils/DatesHelper'
import axiosClient from '../../../../axios-client';
import { UilTrashAlt } from '@iconscout/react-unicons'
import { UilEdit } from '@iconscout/react-unicons'
import { UilExpandAlt } from '@iconscout/react-unicons'
import { UilCompressAlt } from '@iconscout/react-unicons'
import validateAPI from '../../../../utils/textValidation'
import './AddProducto.css'
import TableListaProductos from '../../../Common/Table/Table'
import Resume from '../../../Common/Resume/Resume.';
import {TextField, TextArea, SelectField, ImgField, DateField} from '../../../Common/AwesomeFields/AwesomeFields'
import { UilColumns } from '@iconscout/react-unicons'
import CheckMenu from '../../../Common/CheckMenu/CheckMenu';
import { AiOutlineProduct } from "react-icons/ai";
import { BsBoxes } from "react-icons/bs";
import AlertDialog from '../../../Common/AlertDialog/AlertDialog';
import '../../../Common/Styles/buttons.css'
import CardView from '../../../Common/CardViews/CardView'
import { debounce } from 'lodash';
// go
const formatTable = (table, categorias, marcas, unidadesMedida, almacenes, estados, tipos) => {
  const formatedTable = []
  for (let row of table) {
    let copyRow = {...row}
    // Dar un valor descriptivo al usuario para los valores establecidos con los campos select
    try {
      copyRow.Categoria = categorias.find(Categoria => String(Categoria.value) === String(copyRow.Categoria)).label
      copyRow.Marca = marcas.find(Marca => String(Marca.value) === String(copyRow.Marca)).label
      copyRow['Unidad de medida'] = unidadesMedida.find(medida => String(medida.value) === String(copyRow['Unidad de medida'])).label
      copyRow.Almacen = almacenes.find(Almacen => String(Almacen.value) === String(copyRow.Almacen)).label
      copyRow.Estado = estados.find(Estado => String(Estado.value) === String(copyRow.Estado)).label
      copyRow.Caducidad = tipos.find(tipo => String(tipo.value) === String(copyRow.Caducidad)).label
    } catch (e) {
      console.log('Error en: '+e)
    }


    // Dar un valor mas literal a las columnas nulas
    let columns = Object.keys(copyRow)
    for (let column of columns) {
      if (copyRow[column] === 'null') {
        copyRow[column] = ''
      }
    }

    if (copyRow.Imagen != '') {
      copyRow.Imagen = <Avatar alt={'producto'} src={`data:image/jpeg;base64,${copyRow.Imagen}`}/> 
    }

    formatedTable.push(copyRow)
  }
  return formatedTable
}


const init ={
  id: 1,
  Imagen: '',
  Nombre: '',
  'Codigo de barra': '',
  'Descripcion': '',
  Categoria: 'empty',
  Marca: 'empty',
  'Unidad de medida' : 'empty',
  'Precio de venta': '',
  Cantidad: '',
  Minimo: '',
  Maximo: '',
  Estado: 't',
  Almacen: 'empty',
  Metodo: 'peps',
  Caducidad: 'f',
  'Fecha de vencimiento': '',
  comprobante: ''
}


const establecerColumnasPersonalizadas = (row) => {
  const columnas =  Object.keys(row)
  const unchecked = ['Categoria', 'Marca', 'Unidad de medida', 'Cantidad', 'Minimo', 'Maximo', 'Estado', 'Almacen', 'Metodo', 'Caducidad', 'Fecha de vencimiento', 'Descripcion de la temporada', 'Fecha de inicio de la temporada', 'Fecha final de la temporada', 'comprobante']
  const state = [] // Configuracion inicial de las columnas
  for (let columna of columnas) {
    state.push({label: columna, checked: unchecked.findIndex(u=>u==columna) != -1 ? false : true})
  }
  return state
  return []
}

const AddProducto = React.memo((props) => {

  const {
    setOpen,
    refresh,
    categorias=[],
    marcas=[],
    unidades_medida=[],
    almacenes=[],
    productos=[]
  } = props

  const [nuevoProducto, setNuevoProducto] = useState(init)
  const [listaNuevosProductos, setListaNuevosProductos] = useState([])
  const [markAsIncomplete, setMarkAsIncomplete] =  useState([])
  const [listFullSize, setListFullSize] = useState(false)
  const [nuevoStock, setNuevoStock] = useState('f')
  const [edit, setEdit] = useState(null)
  const [eliminar, setEliminar] = useState(null)
  
  const [columnas, setColumnas] = useState(establecerColumnasPersonalizadas(nuevoProducto))
  const [rollbacks, setRollbacks] = useState({
    'Nombre': false,
    'Codigo de barra': false,
    'Minimo': false,
    'Maximo': false,
    'Fecha de vencimiento': false,
    'Imagen': false
  }) /* rollbacks indica que campos tienen errores logicos, si al menos un campo es true entonces se hara un rollback
        antes de ingresar el producto a la lista y en los campos que sean true se mostrar una alerta al usuario sobre su error*/

  const dispatch = useContext(NotificationContext)
  
  const [items, setItems] = useState({
    Categoria: '',
    Marca: '',
    'Unidad de medida': ''
  })


  const handleDoubleCostValidation = debounce((constraint1, constraint2, validation) => {
    if (validation(constraint1.value, constraint2.value)) {
      setRollbacks({
        ...rollbacks,
        [constraint1.label]: true,
        [constraint2.label]: true
      })
    } else {
      setRollbacks({
        ...rollbacks,
        [constraint1.label]: false,
        [constraint2.label]: false
      })
    }
  }, 300)
  
  const handleConditionalCostValidation = debounce((constraint, value, validation) => {
    if (validation(value)) setRollbacks({
      ...rollbacks,
      [constraint]: true
    })
    else setRollbacks({
      ...rollbacks,
      [constraint]: false
    })
  }, 50)

  const handleFoundCostValidation = debounce((constraint, value, setWarning)=>{
    function myConcat(arr1, arr2) {
      let concatenated = []
      for (let e1 of arr1) {
        concatenated.push(e1)
      }
      for (let e2 of arr2) {
        concatenated.push(e2)
      }
      return concatenated
    }
    let matrix = myConcat(productos, listaNuevosProductos)
    let prod = matrix.find(producto=> String(producto[constraint]) === value)
    if (prod) {
      setWarning(`Producto con el mismo valor de "${constraint}" encontrado en la matriz de productos`)
      setRollbacks({
        ...rollbacks,
        [constraint]: true
      })
    } else {
        setWarning('')
        setRollbacks({
          ...rollbacks,
          [constraint]: false
        })
    }
  }, 300)

  

  const generalActions = [
    {
        icon: <UilTrashAlt />,
        label: 'Eliminar producto/s',
        condition: (numSelected) => numSelected > 0,
        action: (selected) => setEliminar(selected)
    },
    {
        icon: <CheckMenu columns={columnas} setColumns={setColumnas} icon={<UilColumns />}  />,
        label: '',
        condition: () => listaNuevosProductos.length > 0,
        action: () => null
    },
    {
      icon: !listFullSize ? <UilExpandAlt   /> : <UilCompressAlt />,
      label: !listFullSize ? 'Expandir' : 'Comprimir',
      condition: () => !edit,
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

  const configTable = (table, columns) => {
    const configuredTable = []
    for (let row of table) {
      let configuredRow = {}
      for (let {label, checked} of columns) {
        if (checked) configuredRow[label] = row[label]
      }
      configuredTable.push(configuredRow)
    }
  
    return configuredTable
  }

  const handleAgregarNuevoProducto = (producto) => {
    const required = ['Nombre', 'Descripcion', 'Categoria', 'Marca', 'Unidad de medida', 'Precio de venta', 'Minimo', 'Maximo', 'Metodo']
    const incompletes = []

    // Si se agregara un stock inicial Cantidad y Almacen deben ser requeridos
    if (nuevoStock === 't') {
      required.push('Cantidad')
      required.push('Almacen')
      if (producto['Caducidad']==='t') {
        required.push('Fecha de vencimiento')
      }
    } 



    // Validaciones para registrar un nuevo producto
    
    // Campos requeridos vienen vacios:
    for (let require of required) {
      if (!producto[require] || producto[require] === '' || producto[require] === 'empty') {
        incompletes.push(require)
      }
    }
   
    if (incompletes.length > 0) {
      setMarkAsIncomplete(incompletes)
      return
    } 

    // Revisar si se hara un rollback logico
    for (let rollback of Object.keys(rollbacks)) { 
      if (rollbacks[rollback]) return // Si al menos existe un error logico realizar rollback
    }

    // Warnings
    if (nuevoStock) {
      if (Number(producto.Cantidad) < Number(producto.Minimo)) {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: v4(),
            type: 'warning',
            title: 'Stock en escazes',
            icon: <UilExclamationTriangle />,
            message: 'La Cantidad que ingresaras es menor a la minima'
          }
        })
      }
  
      if (Number(producto.Cantidad) > Number(producto.Maximo)) {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: v4(),
            type: 'warning',
            title: 'Stock en exceso',
            icon: <UilExclamationTriangle />,
            message: 'La Cantidad que ingresaras es mayor al Maximo'
          }
        })
      }

    }
    
    // Condiciones validadadas(en este punto la entrada es correcta y se manejara para mandarse a la lista de nuevos productos)
    // Quitar alertas de incompletitud
    setMarkAsIncomplete([])

    // Realizar copia del producto
    const copiaProducto = {...producto}

    // Parsear la copia del producto al formato de datos que espera la base de datos
    copiaProducto.Categoria = Number(copiaProducto.Categoria)
    copiaProducto.Marca = Number(copiaProducto.Marca)
    copiaProducto['Unidad de medida'] = Number(copiaProducto['Unidad de medida'])
    copiaProducto.Almacen = Number(copiaProducto.Almacen)
    copiaProducto['Precio de venta'] = Number(copiaProducto['Precio de venta'])
    copiaProducto.Cantidad = nuevoStock === 't' ? Number(copiaProducto.Cantidad) : 'null'
    copiaProducto.Minimo = Number(copiaProducto.Minimo)
    copiaProducto.Maximo = Number(copiaProducto.Maximo)
    
    // convertir vacios a null
    const keys = Object.keys(copiaProducto)
    for (let key of keys) {
      if (copiaProducto[key] == '') copiaProducto[key] = 'null'
    }

    if (edit) {
      const productoEditarIndex = listaNuevosProductos.findIndex(producto=>producto.id === edit)
      const ultimoProducto = listaNuevosProductos[listaNuevosProductos.length - 1] // Guardar el ultimo id para restituirlo al finalizar la edicion
      const ultimoId = ultimoProducto.id
      const copiaLista = listaNuevosProductos.slice()
      // restituir nuevo producto
      setNuevoProducto(prev => {
        return {
          ...init,
          id: ultimoId + 1
        }
      })

      copiaLista[productoEditarIndex] = copiaProducto
      setListaNuevosProductos(copiaLista)
      setEdit(null)
    } else {
      const copiaLista = listaNuevosProductos.slice()
      // Preparacion para el siguiente producto
      setNuevoProducto(prev => {
        return {
          ...init,
          id: prev.id + 1
        }
      })

      // agregar producto a la lista de nuevos productos
      
      setListaNuevosProductos([copiaProducto, ...copiaLista])
    }

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
      producto.Categoria = Number(producto.Categoria)
      producto.Marca = Number(producto.Marca)
      producto['Unidad de medida'] = Number(producto['Unidad de medida'])
      producto.Almacen = Number(producto.Almacen)
      producto['Precio de venta'] = Number(producto['Precio de venta'])
      producto.Cantidad = producto.Cantidad == 'null' ? 'null' : Number(producto.Cantidad)
      producto.Minimo = Number(producto.Minimo)
      producto.Maximo = Number(producto.Maximo)
    }

    //Establecer nuevos productos a la tabla de catalogo
    // Realizar peticion post console.log
    const payload = {productos: listaNuevosProductos}
    
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
      console.log(messageErr)
    })
    
  }

  const handleChangeNuevoProducto = (value, setErr, key, validate, personalized='') => {

    // Validar entrada actual
    // Validar caracter por caracter
    
    if (key == 'Nombre' || key == 'Descripcion') {
      setNuevoProducto({
        ...nuevoProducto,
        [key]: value
      })
      return
    }

    if (!validate(value)) {
      // Mostrar mensaje
      setErr(personalized!==''? personalized : `Entrada incorrecta: ${value}`)
      return
    } else {
      setErr('')
    }
    
    if (key === 'Imagen') {
      if (value==='') {
        setNuevoProducto({
          ...nuevoProducto,
          [key]: value
        })
        return
      }  
      
      // Validar tipos permitidos en la imagen
      if (value.type !== 'image/avif' && value.type !== 'image/png' && value.type !== 'image/jpeg') return
      

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

    const categoriasUsable = categorias.slice()
    const marcasUsable = marcas.slice()
    const unidades_medidaUsable = unidades_medida.slice()

    //  Agregar opcion de crear nueva Categoria
    categoriasUsable.unshift({value: 'new', label: 'Nueva Categoria'})
    //  Agregar opcion de crear nueva Marca
    marcasUsable.unshift({value: 'new', label: 'Nueva Marca'})
    //  Agregar opcion de crear nueva Categoria
    unidades_medidaUsable.unshift({value: 'new', label: 'Nueva unidad de medida'})


  useEffect(()=>{
    if(edit) {
      // Establecer vista para editar
      setListFullSize(false)
      // Recuperar producto a editar
      const productoEditarIndex = listaNuevosProductos.findIndex(producto=> producto.id === edit)
      const productoEditar = {...listaNuevosProductos[productoEditarIndex]}
      // Reformatear producto(Formatear los valores al formato de nuevo producto)
      const keys = Object.keys(productoEditar)
      for(let key of keys) {
        if (productoEditar[key] === 'null' || !!!productoEditar[key]) {
          productoEditar[key] = ''
        }
      }
      setNuevoProducto(productoEditar)
    }
  }, [edit])

  return (

    <div className='container'>

      <AlertDialog
       open={eliminar ? true : false}
       contentText={eliminar ? `Seguro deseas eliminar ${eliminar.length > 1 ? `estos ${eliminar.length} productos` : 'este producto'}` : ''}
       cancelText='Cancelar'
       acceptText='Eliminar'
        acceptAction={()=>{
          setListaNuevosProductos(prev => {
            const reducedList = []
            for (let row of prev) {
              if (eliminar.findIndex(bye=> bye == row.id) !== -1) continue
              reducedList.push(row)
            }
            return reducedList
          })
          setEliminar(null)
          }
        }
        cancelAction={()=>setEliminar(null)}
      />

      <div className={`glass ${listFullSize ? 'fullGlass' : 'partialGlass'}`}>

      <div className='exit'>
              <IconButton  onClick={() => setOpen(false)}>
                  <ArrowBackIcon />
              </IconButton>
      </div>


        <div className='formCarrito'>

            <div>            
              <div className='mainData'>
                <div className='TitleContainer'>
                  <div className='Title'>
                    <h3>Nuevos productos</h3>
                    <span style={{
                      background: '#E8E1FF',
                      color: '#5E3AE6',
                    }}><AiOutlineProduct /></span>
                  </div>
                  <p>*Ingrese la informacion general de un nuevo producto</p>
                </div>
              </div>
            </div>

            <div className='mainData'>
              <Divider />
            </div>

          <div className='mainData'>
             <TextField 
                  value={nuevoProducto.Nombre} 
                  incomplete={markAsIncomplete.find(l=>l=='Nombre')} 
                  onChange={(value, setErr, setWarning)=> {
                    if (!edit) handleFoundCostValidation('Nombre', value, setWarning)
                    handleChangeNuevoProducto(value, setErr, 'Nombre', validateAPI.everything)
                  }} 
                  label='Nombre del producto' 
                  placeholder='Requerido'
                />
          </div>

          <div className='secondaryData'>
                <TextField 
                  value={nuevoProducto['Codigo de barra']} 
                  onChange={(value, setErr, setWarning)=> {
                    if (!edit) handleFoundCostValidation('Codigo de barra', value, setWarning)
                    handleChangeNuevoProducto(value, setErr, 'Codigo de barra', validateAPI.numeric, 'Maximo de digitos: 15. Solo digitos permitidos')
                  }} 
                  label='Codigo de barra' 
                  placeholder='**********'
                  />

                <TextField 
                  value={nuevoProducto['Precio de venta']} 
                  incomplete={markAsIncomplete.find(l=>l=='Precio de venta')} 
                  onChange={(value, setErr)=> {
                    if(validateAPI.priceTruncated(value)) {
                      handleChangeNuevoProducto(value, setErr, 'Precio de venta', validateAPI.positiveReal)
                    }
                  }} 
                  label='Precio de venta'
                  placeholder='C$'
                />
            </div>

            <div className='mainData'>
              <TextArea 
                  value={nuevoProducto.Descripcion} 
                  incomplete={markAsIncomplete.find(l=>l=='Descripcion')} 
                  onChange={(value, setErr)=> {
                    handleChangeNuevoProducto(value, setErr, 'Descripcion', validateAPI.everything)
                  }} 
                  label='Descripcion del producto' 
                  placeholder='Requerido'
                />
            </div>

            <div className='secondaryData'>
                
              <TextField 
                  value={nuevoProducto.Maximo} 
                  incomplete={markAsIncomplete.find(l=>l=='Maximo')} 
                  desactiveManually={!rollbacks['Maximo']}
                  onChange={(value, setErr, setWarning)=> {
                    if (nuevoProducto.Minimo !== '') {
                      const Maximo = Number(value)
                      const Minimo = Number(nuevoProducto.Minimo)
                      handleDoubleCostValidation({label: 'Maximo', value: Maximo}, {label: 'Minimo', value: Minimo}, (val1, val2) => {
                        if(val1 < val2) { 
                          setWarning('Maximo no puede ser menor al minimo')
                          return true
                        }
                        else if (val1 === val2) {
                          setWarning('Debes dejar un margen entre el maximo y minimo')
                          return true
                        }
                        else {
                          setWarning('')
                          return false
                        }
                      })
                    }
                    handleChangeNuevoProducto(value, setErr, 'Maximo', validateAPI.number)
                  }} 
                  label='Maximo de existencias' 
                  placeholder='Requerido'
                  />

                <TextField 
                  value={nuevoProducto.Minimo} 
                  incomplete={markAsIncomplete.find(l=>l=='Minimo')} 
                  desactiveManually={!rollbacks['Minimo']}
                  onChange={(value, setErr, setWarning)=> {
                    if (nuevoProducto.Maximo !== '') {
                      const Minimo = Number(value)
                      const Maximo = Number(nuevoProducto.Maximo)
                      handleDoubleCostValidation( {label: 'Minimo', value: Minimo}, {label: 'Maximo', value: Maximo}, (val1, val2) => {
                        if(val1 > val2) { 
                          setWarning('Minimo no puede ser mayor al maximo')
                          return true
                        }
                        else if (val1 === val2) {
                          setWarning('Debes dejar un margen entre el maximo y minimo')
                          return true
                        }
                        else {
                          setWarning('')
                          return false
                        }
                      })
                    }

                    handleChangeNuevoProducto(value, setErr, 'Minimo', validateAPI.number)
                  }} 
                  label='Minimo de existencias' 
                  placeholder='Requerido'
                  />     
              </div>

              <div className='secondaryData'>
                
                <div style={{display: nuevoProducto.Categoria === 'new' ? 'none' : ''}}>
                  <SelectField 
                      incomplete={markAsIncomplete.find(l=>l=='Categoria')} 
                      value={nuevoProducto.Categoria} options={categoriasUsable} 
                      onChange={(value, setErr)=> {
                        handleChangeNuevoProducto(value, setErr, 'Categoria', (n)=>true)
                      }} 
                      label='Categoria del producto'
                    />
                </div>
                
                <div style={{display: nuevoProducto.Categoria === 'new' ? '' : 'none'}} className='campoNuevaCategoria nuevoItem'>
                    <div className='secondaryData'>
                      <TextField 
                        value={items.Categoria} 
                        incomplete={markAsIncomplete.find(l=>l=='Categoria')} 
                        onChange={(value, setErr)=> {
                          if (validateAPI.name(value)) {
                            setItems({
                              ...items,
                              Categoria: value
                            })
                          } 
                        }} 
                        label='Nueva Categoria' 
                        placeholder='Requerido'
                      />
                      <div className='btnGroup'>
                      <button onClick={() => {
                        const payload = {categoria: items.Categoria}
                        axiosClient.post('/categoria', payload)
                          .then(({data}) => {
                            const Categoria = data.data
                            const value = Categoria.value.val
                            const label = Categoria.label.label
                            setNuevoProducto({
                              ...nuevoProducto,
                              Categoria: value
                            })
                            setItems({
                              ...items,
                              Categoria: ''
                            })
                            categorias.unshift({value, label})
                          })
                          .catch(error => {
                            const messageError = error.response.data
                            console.log(messageError);
                          })
                      }}>
                        Crear
                      </button>
                      <button onClick={()=>{
                        setNuevoProducto({
                          ...nuevoProducto,
                          ['Categoria']: 'empty'
                        })
                        setItems({
                          ...items,
                          Categoria: ''
                        })
                      }}>
                        Cancelar
                      </button>
                      </div>
                    </div>
                </div>

                <div style={{display: nuevoProducto.Marca === 'new' ? 'none' : ''}}>
                  <SelectField 
                      incomplete={markAsIncomplete.find(l=>l=='Marca')} 
                      value={nuevoProducto.Marca} options={marcasUsable} 
                      onChange={(value, setErr)=> {
                        handleChangeNuevoProducto(value, setErr, 'Marca', (n)=>true)
                      }} 
                      label='Marca del producto'
                    />
                </div>
                <div style={{display: nuevoProducto.Marca === 'new' ? '' : 'none'}} className='campoNuevaMarca nuevoItem'>
                    <div className='secondaryData'>
                      <TextField 
                        value={items.Marca} 
                        incomplete={markAsIncomplete.find(l=>l=='Marca')} 
                        onChange={(value, setErr)=> {
                          if (validateAPI.name(value)) {
                            setItems({
                              ...items,
                              Marca: value
                            })
                          } 
                        }} 
                        label='Nueva Marca' 
                        placeholder='Requerido'
                      />
                      <div className='btnGroup'>
                      <button onClick={() => {
                        const payload = {marca: items.Marca}
                        axiosClient.post('/marca', payload)
                          .then(({data}) => {
                            const Marca = data.data
                            const value = Marca.value.val
                            const label = Marca.label.label
                            
                            setNuevoProducto({
                              ...nuevoProducto,
                              Marca: value
                            })
                            setItems({
                              ...items,
                              Marca: ''
                            })
                            marcas.unshift({value, label})
                          })
                          .catch(error => {
                            const messageError = error.response.data
                            console.log(messageError);
                          })
                      }}>Crear</button>
                      <button onClick={()=>{
                        setNuevoProducto({
                          ...nuevoProducto,
                          ['Marca']: 'empty'
                        })
                        setItems({
                          ...items,
                          Marca: ''
                        })
                      }}>
                        Cancelar
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='secondaryData'>
                <div style={{display: nuevoProducto['Unidad de medida'] === 'new' ? 'none' : ''}}>
                  <SelectField 
                    incomplete={markAsIncomplete.find(l=>l=='Unidad de medida')} 
                    value={nuevoProducto['Unidad de medida']} options={unidades_medidaUsable} 
                    onChange={(value, setErr)=> {
                      handleChangeNuevoProducto(value, setErr, 'Unidad de medida', (n)=>true)
                    }} 
                    label='Medida del producto'
                    />
                </div>

                <div style={{display: nuevoProducto['Unidad de medida'] === 'new' ? '' : 'none'}} className='campoNuevaUnidadMedida nuevoItem'>
                    <div className='secondaryData'>
                      <TextField 
                        value={items['Unidad de medida']} 
                        incomplete={markAsIncomplete.find(l=>l=='Unidad de medida')} 
                        onChange={(value, setErr)=> {
                          if (validateAPI.name(value)) {
                            setItems({
                              ...items,
                              'Unidad de medida': value
                            })
                          } 
                        }} 
                        label='Nueva medida' 
                        placeholder='Requerido'
                      />
                      <div className='btnGroup'>
                      <button onClick={() => {
                        const payload = {medida: items['Unidad de medida']}
                        axiosClient.post('/unidad_medida', payload)
                          .then(({data}) => {
                            const medida = data.data
                            const value = medida.value.val
                            const label = medida.label.label
                  
                            setNuevoProducto({
                              ...nuevoProducto,
                              'Unidad de medida': value  
                            })
                            setItems({
                              ...items,
                              ['Unidad de medida']: ''
                            })
                            unidades_medida.unshift({value, label})
                          })
                          .catch(error => {
                            const messageError = error.response.data
                            console.log(messageError);
                          })
                      }}>Crear</button>
                      <button onClick={()=>{
                        setNuevoProducto({
                          ...nuevoProducto,
                          ['Unidad de medida']: 'empty'
                        })
                        setItems({
                          ...items,
                          ['Unidad de medida']: ''
                        })
                      }}>
                        Cancelar
                      </button>
                      </div>
                    </div>
                </div>

                <SelectField 
                    value={nuevoProducto.Metodo} 
                    options={[{label: 'peps', value: 'peps'}, {label: 'ueps', value: 'ueps'}]} 
                    onChange={(value, setErr)=> {
                      handleChangeNuevoProducto(value, setErr, 'Metodo', (n)=>true)
                    }} 
                    label='Metodo de inventario'
                  />
                </div>
             



          

              <div className='secondaryData'>
            
                <SelectField 
                    value={nuevoProducto.Caducidad} 
                    options={[{label: 'no', value: 'f'}, {label: 'si', value: 't'}]} 
                    onChange={(value, setErr)=> {
                      handleChangeNuevoProducto(value, setErr, 'Caducidad', (n)=>true)
                    }}
                    label='Tiene fecha de caducidad?'
                  />

                <ImgField 
                  incomplete={markAsIncomplete.find(l=>l=='Imagen')} 
                  onChange={(value, setErr, setWarning)=> {
                    handleConditionalCostValidation('Imagen', value, (img)=> {
                      if (img.type !== 'image/avif' && img.type !== 'image/png' && img.type !== 'image/jpeg') {
                        setWarning('Formato de archivo invalido')
                        return true
                      } 
                      setWarning('')
                      return false
                    })
                    handleChangeNuevoProducto(value, setErr, 'Imagen', validateAPI.everything)
                  }} 
                  label='Imagen del producto' 
                  placeholder='Opcional'
                  />                  

              </div>

              <div className='mainData'>
                <SelectField 
                  value={nuevoStock}
                  label='¿Quieres ingresar un stock inicial sin hacer una orden?'
                  options={[
                    {value: 't', label: 'Si'},
                    {value: 'f', label: 'No'},
                  ]}
                  onChange={(value) => {
                    setNuevoStock(value)
                  }}
                />
              </div>

            <div style={{display: nuevoStock === 'f' ? 'none' : ''}}>
              <div className='mainData'>
                <div className='TitleContainer'>
                  <div className='Title'>
                    <h3>Informacion de Stock</h3>
                    <span style={{
                      background: '#D9FFF1',
                      color: '#60E7B6',
                    }}><BsBoxes /></span>
                  </div>
                  <p>*Informacion de stock inicial de {nuevoProducto['Nombre']}</p>
                </div>
              </div>

              <div className='mainData'>
                <Divider />
              </div>
            </div>

              <div style={{display: nuevoStock === 'f' ? 'none' : ''}}>
                <div className='mainData'>
                  <TextField 
                    value={nuevoProducto.Cantidad} 
                    incomplete={markAsIncomplete.find(l=>l=='Cantidad')} 
                    onChange={(value, setErr, setWarning)=> {
                      handleChangeNuevoProducto(value, setErr, 'Cantidad', validateAPI.positiveIntegerOrZero)
                    }} 
                    label='Cantidad inicial de stock' 
                    placeholder='Requerido'
                  />                    
                </div>

                <div className='mainData'>
                 <SelectField 
                    incomplete={markAsIncomplete.find(l=>l=='Almacen')} 
                    value={nuevoProducto.Almacen} options={almacenes} 
                    onChange={(value, setErr)=> {
                      handleChangeNuevoProducto(value, setErr, 'Almacen', (n)=>true)
                    }} 
                    label='Almacen a guardar'
                  />
                </div>

                <div style={{display: nuevoProducto['Caducidad'] === 'f' ? 'none' : ''}} className='mainData'>
                  <DateField
                    value={nuevoProducto['Fecha de vencimiento']}
                    incomplete={markAsIncomplete.find(l=>l=='Fecha de vencimiento')}
                    onChange={(value, setErr, setWarning)=> {
                      handleConditionalCostValidation('Fecha de vencimiento', value, (date)=> {
                        if (DateHandler.isLesserOrEqual(date, DateHandler.getCurrentDate())) {
                          setWarning('Fecha de vencimiento invalida')
                          return true
                        }
                        else {
                          setWarning('')
                          return false
                        }
                      })
                      handleChangeNuevoProducto(value, setErr, 'Fecha de vencimiento', (n)=>true)
                    }
                  }
                    label='Fecha de vencimiento'/>
                </div>

              </div>

        </div>

        <div className='listaNuevosProductos'>
          <TableListaProductos 
            dense={true}
            pagination={false}
            empty={<CardView type='almacenVacio' loop={listaNuevosProductos.length === 0}/>}
            generalActions={generalActions}
            actions={actions}
            setEdit={setEdit}
            rows={configTable(formatTable(listaNuevosProductos, categorias, marcas, unidades_medida, almacenes, [{value: 't', label: 'Activo'}, {value: 'f', label: 'Inactivo'}], [{value: 't', label: 'Perecedero'}, {value: 'f', label: 'Persistente'}]), columnas)}
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
                    const total = dataSet.reduce((a,b) => typeof b.Cantidad == 'number' ? a + b.Cantidad : a, 0)
                    
                    return  <div style={{display: 'flex'}}>
                                <p>Total de nuevo stock: {total}</p> 
                              </div>
                  }
                
                ]
              }
            />}
          />
        </div>

        <button style={{display: edit ? 'none' : ''}} onClick={() => handleAgregarNuevoProducto(nuevoProducto)} className={`btnAgregarProducto ${!listFullSize ? 'partialBtn' : 'noneBtn'}`}>Agregar a la lista</button>
        <div style={{display: !edit ? 'none' : ''}} className='editBtns'>
          <button onClick={()=>handleAgregarNuevoProducto(nuevoProducto)}>Actualizar</button>
          <button onClick={()=>setEdit(null)}>Cancelar</button>
        </div>
        <button  onClick={() => addNuevosProductos(listaNuevosProductos)} id='agregarLista' className={`btnAgregarLista ${!listFullSize ? 'partialBtn' : 'fullBtn'}`}>Registrar Productos</button>
      </div>
   

    </div>

  )
})



export default AddProducto
