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
import hexToDataURL from '../../../../utils/HexToDataUrl'
import axiosClient from '../../../../axios-client'
import { Avatar } from '@mui/material'
import {NotificationContext} from '../../../Notifications/NotificationProvider'
import { v4, validate } from 'uuid'
import DBParser from '../../../../utils/DbFieldsConverter'
import validateAPI from '../../../../utils/textValidation'
import Resume from '../../../Common/Resume/Resume.'

const formatTable = (table, estados, metodos, categorias, marcas, unidades_medida) => {
    const formatedTable = []
    for (let row of table) {
      let copyRow = {...row}  
    
      if (copyRow.Imagen != '' || copyRow.Imagen != null) {
        copyRow.Imagen = <Avatar alt={'producto'} src={hexToDataURL(copyRow.Imagen)}/> 
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

const requestUpdate = (id, payload) => {
  const formatedPayload = {}
  for (let key of Object.keys(payload)) {
    formatedPayload[DBParser.Productos[key]] = payload[key] // Convertir los nombres de los campos a los validos en la base de datos
  }
  const finalPayload = {id: id, payload: formatedPayload}
  axiosClient.post('updateProducto', finalPayload)
    .then(({data}) => {
      console.log('Actualizado: '+ data.data)
    })
    .catch(err=> {
      const messageErr = err.response.data.messageError
      console.log('Error en la respuesta del servidor al actualizar el producto '+messageErr);
    })
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

    const dispatch = useContext(NotificationContext)

    const generalActions = [
        {
            icon: <UilStopCircle />,
            label: 'desactivar-producto/s',
            condition: (numSelected) => numSelected > 0,
            action: (selected) => {
                const payload = {productos: selected}
                console.log(payload)
                axiosClient.post('/desactivate-productos', payload)
                    .then(({data})=> {
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
                      getProductos()
                    }).catch(err=> {
                        console.log('Error en la respues al desabilitar los productos: '+err)
                    })
            }
        },
        {
            icon: <UilPlus />,
            label: 'nuevo-producto',
            condition: () => true,
            action: () => setFormOpen(true)
        },
        {
            icon: <UilFilter />,
            label: 'filtrar-productos',
            condition: () => true,
            action: () => alert('Filtrar Productos  ')
        }
    ]
    
    const actions = [
        {
            label: 'Editar',
            icon: <UilEdit />,
            action: (id) => setEdit(id)
        },
        {
            label: 'Ver detalles',
            icon: <UilEye />,
            action: (i) => alert('Ver detalles '+i)
        }
    ]

    useEffect(() => {
        getProductos()
        getItems()
    }, [])


  // Retribuir datos seleccionables de la BD  

  const getProductos = () => {
    axiosClient.get('/productos')
    .then(({data}) => {
        setProductos(data.data)
        console.log(data.data)
    })
    .catch(error=> {
        const messageErr = error.response.data.messageError
        console.log(messageErr)
    })  

  }

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
        <>
        <div className='CatalogoProductos'>
            {/** AddProducto(Metete a AddProducto.jsx y el css en AddProducto.css) es el formulario de nuevos productos */}
            <RightDrawer width={'100vw'} content={<AddProducto refresh={getProductos} productos={productos} setProductos={setProductos} categorias={categorias} marcas={marcas} unidades_medida={unidades_medida} almacenes={almacenes} setOpen={setFormOpen}/>} open={formOpen}/>
            <Banner>Catalogo de Productos</Banner>
            <div className='catalogo'>
                <Table 
                    requestUpdate={requestUpdate}
                    edit={edit}
                    pagination={false}
                    setEdit={setEdit}
                    editables={[
                      {label: 'Categoria', type: 'select', validation: () => categorias},
                      {label: 'Marca', type: 'select', validation: () => marcas},
                      {label: 'Unidad de medida', type: 'select', validation: () => unidades_medida},
                      {label: 'Nombre', type: 'text', validation: () =>  (input) => [validateAPI.name(input), `Simbolo: ${input} no valido`]},
                      {label: 'Descripcion', type: 'text', validation:  (input) => [validateAPI.everything(input), `Simbolo: ${input} no valido`]},
                      {label: 'Precio de venta', type: 'text', validation: (input) => [validateAPI.positiveReal(input), `Simbolo: ${input} no valido`]},
                      {label: 'Codigo de barra', type:'text', validation: (input) => [validateAPI.numeric(input), `Simbolo: ${input} no valido`]},
                      {label: 'Minimo', type:'text', validation: (input) => [validateAPI.number(input), `Simbolo: ${input} no valido`]},
                      {label: 'Maximo', type:'text', validation: (input) => [validateAPI.number(input), `Simbolo: ${input} no valido`]},
                      {label: 'Metodo', type:'select', validation: (input) =>  [{value: 'peps', label: 'Peps'}, {value: 'ueps', label: 'Ueps'}] }
                    ]}
                    empty='Agrega productos al catalogo!!!'
                    dense={false}
                    actions={actions}
                    generalActions={generalActions}
                    rows={formatTable(productos, [{value: 't', label: 'Activo'}, {value: 'f', label: 'Inactivo'}],  [{value: 'peps', label: 'Peps'}, {value: 'ueps', label: 'Ueps'}], categorias, marcas, unidades_medida)}
                    setRows={setProductos}
                    footer={<Resume 
                      dataSet={productos}
                      calcs={[

                        (dataSet) => {
                          const total = dataSet.reduce((a,b)=> a+Number(b['Total']),0)
                          return <div style={{display: 'flex'}}>
                          <p>Total de existencias en stock: {total}</p>  
                          </div>
                        },

                        (dataSet) => {
                          const totalDisponible = dataSet.reduce((a,b)=> a + Number(b['Disponible']),0) // Suma de todas las existencias disponibles fisicamente
                          return <div style={{display: 'flex'}}>
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

export default Productos