import { useEffect, useState } from 'react'
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

import axiosClient from '../../../../axios-client'





const Productos = () => {

    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(false)

    const [formOpen, setFormOpen] = useState(false)


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
            action: (i) => alert('Editar '+i)
        },
        {
            label: 'Ver detalles',
            icon: <UilEye />,
            action: (i) => alert('Ver detalles '+i)
        }
    ]

    useEffect(() => {
        getProductos()
    }, [])

    const getProductos = () => {
        setLoading(true)
        axiosClient.get('/productos')
            .then(({data}) => {
                setLoading(false)
                console.log(data)
            })
            .catch(() => {
                setLoading(false)
            })
    }

    return (
        <>
        <div className='CatalogoProductos'>
            {/** AddProducto(Metete a AddProducto.jsx y el css en AddProducto.css) es el formulario de nuevos productos */}
            <RightDrawer width={'100vw'} content={<AddProducto setOpen={setFormOpen}/>} open={formOpen}/>
            <Banner>Catalogo de Productos</Banner>
            <Table 
                
                actions={actions}
                generalActions={generalActions}
                rows={[
                    //{id: 1, nombre: 'Martillo', marca: 'Papagayo', categoria: 'Herramientas Manuales', precio: 3.4, cantidad: 234, estado: 'Disponible'}, 
                ]}
            />
        </div>
       </>
    )
}

export default Productos