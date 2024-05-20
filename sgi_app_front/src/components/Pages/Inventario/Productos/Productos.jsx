import { useEffect, useState, useRef } from 'react'
import Banner from '../../../Common/Banner/Banner'
import Table from '../../../Common/Table/Table'
import RightDrawer from '../../../Common/RightDrawer/RightDrawer'
import './Productos.css'
import AddProducto from './AddProducto'
import { UilPlus } from '@iconscout/react-unicons'
import { UilFilter } from '@iconscout/react-unicons'
import { UilTrashAlt } from '@iconscout/react-unicons'
import { UilEdit } from '@iconscout/react-unicons'
import { UilEye } from '@iconscout/react-unicons'
import hexToDataURL from '../../../../utils/HexToDataUrl'
import axiosClient from '../../../../axios-client'

import validateApi from '../../../../utils/textValidation'
import { Avatar } from '@mui/material'

const formatTable = (table) => {
    const formatedTable = []
    for (let row of table) {
      let copyRow = {...row}  
      if (copyRow.Imagen != '' || copyRow.Imagen != null) {
        copyRow.Imagen = <Avatar alt={'producto'} src={hexToDataURL(copyRow.Imagen)}/> 
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

    const generalActions = [
        {
            icon: <UilTrashAlt />,
            label: 'eliminar-productos',
            condition: (selected) => selected > 0,
            action: () => alert('Eliminar Productos')
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
        getItems()
    }, [])

  // Retribuir datos seleccionables de la BD  
  const getItems = () => {
    axiosClient.get('/productos')
    .then(({data}) => {
        setProductos(data.data)
        console.log(data.data)
    })
    .catch(error=> {
        const messageErr = error.response.data.messageError
        console.log(messageErr)
    })  

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
            <RightDrawer width={'100vw'} content={<AddProducto productos={productos} setProductos={setProductos} categorias={categorias} marcas={marcas} unidades_medida={unidades_medida} almacenes={almacenes} setOpen={setFormOpen}/>} open={formOpen}/>
            <Banner>Catalogo de Productos</Banner>
            <div className='catalogo'>
                <Table 
                    edit={edit}
                    setEdit={setEdit}
                    empty='Agrega productos al catalogo!!!'
                    dense={true}
                    actions={actions}
                    generalActions={generalActions}
                    rows={formatTable(productos)}
                    setRows={setProductos}
                />
            </div>
        </div>
       </>
    )
}

export default Productos