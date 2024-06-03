import React, { useEffect, useState, useContext } from 'react'
import Table from '../../../Common/Table/Table'
import Resume from '../../../Common/Resume/Resume.'
import { CircularProgress } from '@mui/material'
import { getItems } from '../LoadData/LoadData'
import { formatColumnsTable } from '../../../../utils/HandleTable'
import { UilEdit } from '@iconscout/react-unicons'
import { UilEye } from '@iconscout/react-unicons'
import { UilPlus } from '@iconscout/react-unicons'
import RightDrawer from '../../../Common/RightDrawer/RightDrawer'
import AddMarca from './AddMarca'

import { UimCheckCircle } from '@iconscout/react-unicons-monochrome'
import { FaTrashCan } from "react-icons/fa6";
import { useStateContext } from '../../../../Contexts/ContextProvider'
import AlertDialog from '../../../Common/AlertDialog/AlertDialog'
import { v4 } from 'uuid'
import axiosClient from '../../../../axios-client'
import { NotificationContext } from '../../../Notifications/NotificationProvider'


const Categorias = () => {
    const [loading, setLoading] = useState(false)
    const [marcas, setMarcas] = useState([])
    const [edit, setEdit] = useState(false)
    const [formOpen, setFormOpen] = useState(false)

    const [desactivar, setDesactivar] = useState(null)
    const dispatch = useContext(NotificationContext)

    const { getPermisos } = useStateContext()
    const permisos = getPermisos()
    const permisoEliminarProductos = permisos.find(p => p.moduloId == 17) && permisos.find(p => p.moduloId == 17).estado === 't' ? true : false

    useEffect(()=>{
        getItems(setLoading, setMarcas, 'marcas')
    }, [])

    const generalActions = [
        {
            icon: <FaTrashCan />,
            label: 'eliminar marca/s',
            condition: (numSelected) => numSelected > 0 && permisoEliminarProductos,
            action: (selected) => setDesactivar(selected)
        },
        {
            label: 'Crear nueva marca',
            condition: ()=>true,
            icon: <UilPlus />,
            action: () => setFormOpen(true)
        }
    ]

    const actions = [
        {
            label: 'Editar',
            icon: <UilEdit />,
            action: (id) => {
              setEdit(id)
            }
        },
        {
            label: 'Ver detalles',
            icon: <UilEye />,
            action: (i) => alert('Ver detalles '+i)
        }
    ]


    if (loading) 
    return (<CircularProgress size='4rem'
        sx={{
        position: 'relative',
        top:'50%',
        left: '40%',
        color: '#6AD096'
        }}/>)
    else return (
        <>

            <AlertDialog
                open={desactivar ? true : false}
                contentText={desactivar ? `Seguro deseas eliminar ${desactivar.length > 1 ? `estas ${desactivar.length} marcas` : 'este marca'}` : ''}
                cancelText='Cancelar'
                acceptText='Eliminar'
                acceptAction={() => {
                    const payload = { marcas: desactivar }
                    axiosClient.post('/desactivate-marcas', payload)
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
                            getItems(setLoading, setMarcas, 'marcas')
                        }).catch(err => {
                            console.log('Error en la respues al desabilitar las marcas: ' + err)
                        })
                }}
                cancelAction={() => setDesactivar(null)}
            />

                <RightDrawer 
                    width={'30vw'} 
                    open={formOpen}
                    content={
                        <AddMarca 
                            setOpen={setFormOpen}
                            marcas={marcas}
                        />
                    }
                    />

            <div className='CatalogoContainer'>
                <div className='catalogo'>
                    <Table 
                        pagination={false}
                        rows={formatColumnsTable(marcas, {'label': 'Nombre', 'value': 'id'})}
                        footer={<h1>Pie de tabla</h1>}
                        actions={actions}
                        generalActions={generalActions}
                    />
                </div>
            </div>
        </>
    )
}

export default Categorias