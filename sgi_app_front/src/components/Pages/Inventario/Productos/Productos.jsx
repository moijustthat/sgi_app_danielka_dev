import { useEffect, useState, useContext } from 'react'
import Banner from '../../../Common/Banner/Banner'
import Table from '../../../Common/Table/Table'
import RightDrawer from '../../../Common/RightDrawer/RightDrawer'
import './Productos.css'
import AddProducto from './AddProducto'
import { UilPlus } from '@iconscout/react-unicons'
import { UilFilter } from '@iconscout/react-unicons'
import { UilStopCircle } from '@iconscout/react-unicons'
import { UilEdit } from '@iconscout/react-unicons'
import { UimCheckCircle } from '@iconscout/react-unicons-monochrome'
import { UilEye } from '@iconscout/react-unicons'
import hexToDataURL, { isHex, base64ToHex } from '../../../../utils/HexToDataUrl'
import axiosClient from '../../../../axios-client'
import { Avatar } from '@mui/material'
import { NotificationContext } from '../../../Notifications/NotificationProvider'
import { v4, validate } from 'uuid'
import DBParser from '../../../../utils/DbFieldsConverter'
import validateAPI from '../../../../utils/textValidation'
import Resume from '../../../Common/Resume/Resume.'
import FormDialog from '../../../Common/FormDialog/FormDialog'
import FormEdit from './FormEdit'
import { UilColumns } from '@iconscout/react-unicons'
import CheckMenu from '../../../Common/CheckMenu/CheckMenu'
import CircularProgress from '@mui/material/CircularProgress';
import AlertDialog from '../../../Common/AlertDialog/AlertDialog'
import { FaTrashCan } from "react-icons/fa6";

import CardView from '../../../Common/CardViews/CardView'

// console
const configTable = (table, columns) => {

  const configuredTable = []

  for (let row of table) {
    let configuredRow = {}
    for (let { label, checked } of columns) {
      if (checked) configuredRow[label] = row[label]
    }
    configuredTable.push(configuredRow)
  }

  return configuredTable
}

const formatTable = (table, estados, metodos, categorias, marcas, unidades_medida) => {
  const formatedTable = []
  for (let row of table) {
    let copyRow = { ...row }

    if (!(copyRow.Imagen === '' || copyRow.Imagen === null)) {
      copyRow.Imagen = <Avatar alt={'producto'} style={{
        width: '3.5rem',
        height: '3.5rem',
      }} src={hexToDataURL(copyRow.Imagen)} />
    }

    try { /*  Como las categorias, marcas y medidas vienen de una peticion 
                entonces en el primero render estaran vacias, por lo que se atraparan
                errores para no afectar el programa
            */
      copyRow['Categoria'] = categorias.find(categoria => String(categoria.value) === String(copyRow['Categoria'])).label
      copyRow['Marca'] = marcas.find(marca => String(marca.value) === String(copyRow['Marca'])).label
      copyRow['Unidad de medida'] = unidades_medida.find(medida => String(medida.value) === String(copyRow['Unidad de medida'])).label
      copyRow['Estado'] = estados.find(activo => String(activo.value) === String(copyRow['Estado'])).label
      copyRow['Metodo'] = metodos.find(metodo => String(metodo.value) === String(copyRow['Metodo'])).label

    } catch (e) {

    }


    formatedTable.push(copyRow)
  }
  return formatedTable
}

const Productos = () => {


  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(null)

  const [formOpen, setFormOpen] = useState(false)
  const [productos, setProductos] = useState([])

  const [categorias, setCategorias] = useState([])
  const [marcas, setMarcas] = useState([])
  const [unidades_medida, setUnidadesMedida] = useState([])
  const [almacenes, setAlmacenes] = useState([])
  const [columnas, setColumnas] = useState([])

  const dispatch = useContext(NotificationContext)

  // Confirmaciones(No se como hacer un provider todavia :()
  const [desactivar, setDesactivar] = useState(null)

  const localUpdate = (id, payload) => {
    setProductos((prev) => {
      const productoActualizarIndex = prev.findIndex(producto => producto.id === id)
      const copiaProductos = prev.slice()
      const productoActualizado = { ...copiaProductos[productoActualizarIndex] }
      const keys = Object.keys(payload)
      for (let key of keys) {
        let val
        if (key === 'Imagen' && !!!isHex(payload[key])) {
          val = base64ToHex(payload[key])
        } else {
          val = payload[key]
        }
        productoActualizado[key] = val
      }
      copiaProductos[productoActualizarIndex] = productoActualizado
      return copiaProductos
    })
  }

  const requestUpdate = (id, payload) => {
    const formatedPayload = {}
    for (let key of Object.keys(payload)) {
      formatedPayload[DBParser.Productos[key]] = payload[key] // Convertir los nombres de los campos a los validos en la base de datos
    }
    const finalPayload = { id: id, payload: formatedPayload }
    axiosClient.post('updateProducto', finalPayload)
      .then(({ data }) => {
        // Una vez actualizado en el backend, actualizar en el front end para no recargar la pagina
        localUpdate(id, payload)
        setEdit(null)
      })
      .catch(err => {
        const messageErr = err.response.data.messageError
        console.log('Error en la respuesta del servidor al actualizar el producto ' + messageErr);
      })
  }

  const generalActions = [
    {
      icon: <FaTrashCan />,
      label: 'desactivar-producto/s',
      condition: (numSelected) => numSelected > 0,
      action: (selected) => setDesactivar(selected)
    },
    {
      icon: <UilPlus />,
      label: 'Nuevos productos',
      condition: () => true,
      action: () => setFormOpen(true)
    },
    {
      icon: <UilFilter />,
      label: 'Filtrar producos',
      condition: () => true,
      action: () => alert('Filtrar Productos  ')
    },
    {
      icon: <CheckMenu columns={columnas} setColumns={setColumnas} icon={<UilColumns />} />,
      label: '',
      condition: () => true,
      action: () => null
    }
  ]

  const actions = [
    {
      label: 'Editar',
      icon: <UilEdit />,
      action: (id) => {
        setEdit(id)
      }
    }
  ]



  // Retribuir datos seleccionables de la BD  

  const getProductos = async () => {
    setLoading(true)
    axiosClient.get('/productos')
      .then(({ data }) => {
        const productos = data.data
        const columnas = productos.length > 0 ? Object.keys(productos[0]) : []
        const unchecked = ['Categoria', 'Marca', 'Unidad de medida', 'Estado', 'Caducidad', 'Codigo de barra', 'Minimo', 'Maximo', 'Metodo', 'Perdidas Totales']
        const state = []
        for (let columna of columnas) {
          state.push({ label: columna, checked: unchecked.findIndex(u => u == columna) != -1 ? false : true })
        }
        setColumnas(state)
        setProductos(productos)
        setLoading(false)
      })
      .catch(error => {
        const messageErr = error.response.data.messageError
        setLoading(false)
      })

  }

  const getItems = async () => {
    setLoading(true)
    axiosClient.get('/seleccionables')
      .then(({ data }) => {
        setCategorias(data.categorias.map((categoria, index) => {
          return {
            label: categoria.nombre,
            value: categoria.categoriaId
          }
        }))
        setMarcas(data.marcas.map((marca, index) => {
          return {
            label: marca.nombre,
            value: marca.marcaId
          }
        }))
        setUnidadesMedida(data.unidades_medida.map((medida, index) => {
          return {
            label: medida.nombre,
            value: medida.unidadMedidaId
          }
        }))
        setAlmacenes(data.almacenes.map((almacen, index) => {
          return {
            label: almacen.nombre,
            value: almacen.almacenId
          }
        }))
        setLoading(false)
      })
      .catch((e) => {
        console.log('Error en la respuesta: ' + e);
        setLoading(false)
      })
  }

  useEffect(() => {
    getProductos()
    getItems()
  }, [])




  if (loading) {
    return <CircularProgress
      size='4rem'
      sx={{
        position: 'relative',
        top: '50%',
        left: '40%',
        color: '#6AD096'
      }} />
  } else {

    function createEditable() {
      const productoEditado = {}

      const producto = productos.find(p => p.id == edit)
      productoEditado['Nombre'] = producto['Nombre']
      productoEditado['Descripcion'] = producto['Descripcion']
      productoEditado['Codigo de barra'] = producto['Codigo de barra']
      productoEditado['Precio de venta'] = producto['Precio de venta']
      productoEditado['Categoria'] = producto['Categoria']
      productoEditado['Marca'] = producto['Marca']
      productoEditado['Unidad de medida'] = producto['Unidad de medida']
      productoEditado['Metodo'] = producto['Metodo']
      productoEditado['Minimo'] = producto['Minimo']
      productoEditado['Maximo'] = producto['Maximo']
      productoEditado['Imagen'] = producto['Imagen']
  
      const productoNombre = producto ? producto['Nombre'] : ''
      const productoImagen = producto ? producto['Imagen'] : null  
      
      return productoEditado
    }

    return (
      <>

        <AlertDialog
          open={desactivar ? true : false}
          contentText={desactivar ? `Seguro deseas eliminar ${desactivar.length > 1 ? `estos ${desactivar.length} productos` : 'este producto'}` : ''}
          cancelText='Cancelar'
          acceptText='Eliminar'
          acceptAction={() => {
            const payload = { productos: desactivar }
            axiosClient.post('/desactivate-productos', payload)
              .then(({ data }) => {
                dispatch({
                  type: 'ADD_NOTIFICATION',
                  payload: {
                    id: v4(),
                    type: 'success',
                    title: 'Exito',
                    icon: <UimCheckCircle />,
                    message: data.data
                  }
                })
                setDesactivar(null)
                getProductos()
              }).catch(err => {
                console.log('Error en la respues al desabilitar los productos: ' + err)
              })
          }}
          cancelAction={() => setDesactivar(null)}
        />

        <div className='CatalogoProductos'>

          <RightDrawer
            width={'40vw'}
            open={edit !== null}
            setOpen={() => setEdit(null)}
            content={<FormEdit
              id={edit}
              setUpdate={setEdit}
              productos={productos}
              requestUpdate={requestUpdate}
              productoEditado={edit!==null ? createEditable() : {}}
              seleccionables={{ categorias, marcas, unidades_medida, metodos: [{ value: 'peps', label: 'Peps' }, { value: 'ueps', label: 'Ueps' }] }}
            />
            }
          />
          <RightDrawer width={'100vw'} content={<AddProducto refresh={getProductos} productos={productos} setProductos={setProductos} categorias={categorias} marcas={marcas} unidades_medida={unidades_medida} almacenes={almacenes} setOpen={setFormOpen} />} open={formOpen} />

          <div className='catalogo'>
            <Table
              dense={true}
              pagination={false}
              empty={<CardView type='box' style={{
                marginLeft: '35%',
                width: '30%',
                height: '100%'
              }} text='No tienes productos en el sistema' />}
              generalActions={generalActions}
              actions={actions}
              setEdit={setEdit}
              rows={configTable(formatTable(productos, [{ value: 't', label: 'Activo' }, { value: 'f', label: 'Inactivo' }], [{ value: 'peps', label: 'Peps' }, { value: 'ueps', label: 'Ueps' }], categorias, marcas, unidades_medida), columnas)}
              setRows={setProductos}
              footer={<Resume
                dataSet={productos}
                calcs={[

                  (dataSet) => {
                    const total = dataSet.reduce((a, b) => a + Number(b['Total']), 0)
                    return <div style={{ display: 'flex' }}>
                      <p>Total de existencias en stock: {total}</p>
                    </div>
                  },

                  (dataSet) => {
                    const totalDisponible = dataSet.reduce((a, b) => a + Number(b['Disponible']), 0) // Suma de todas las existencias disponibles fisicamente
                    return <div style={{ display: 'flex' }}>
                      <p>Total de existencias fisicas: {totalDisponible}</p>
                    </div>
                  },

                ]}
              />}
            />
          </div>
        </div>
      </>
    )
  }
}

export default Productos