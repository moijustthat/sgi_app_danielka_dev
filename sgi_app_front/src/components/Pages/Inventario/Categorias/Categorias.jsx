import React, { useEffect, useState, useContext } from 'react'
import './Categorias.css'
import Table from '../../../Common/Table/Table'
import Resume from '../../../Common/Resume/Resume.'
import { CircularProgress } from '@mui/material'
import { getItems } from '../LoadData/LoadData'
import { formatColumnsTable } from '../../../../utils/HandleTable'
import { UilEdit } from '@iconscout/react-unicons'
import { UilEye } from '@iconscout/react-unicons'
import { UilPlus } from '@iconscout/react-unicons'
import RightDrawer from '../../../Common/RightDrawer/RightDrawer'
import AddCategoria from './AddCategoria'

import { UimCheckCircle } from '@iconscout/react-unicons-monochrome'
import { FaTrashCan } from "react-icons/fa6";
import { useStateContext } from '../../../../Contexts/ContextProvider'
import AlertDialog from '../../../Common/AlertDialog/AlertDialog'
import { v4 } from 'uuid'
import axiosClient from '../../../../axios-client'
import { NotificationContext } from '../../../Notifications/NotificationProvider'

const Categorias = () => {
    const [loading, setLoading] = useState(false)
    const [categorias, setCategorias] = useState([])
    const [edit, setEdit] = useState(false)
    const [formOpen, setFormOpen] = useState(false)
    const [desactivar, setDesactivar] = useState(null)

    const dispatch = useContext(NotificationContext)

    const { getPermisos } = useStateContext()
    const permisos = getPermisos()
    const permisoEliminarProductos = permisos.find(p => p.moduloId == 17) && permisos.find(p => p.moduloId == 17).estado === 't' ? true : false


    useEffect(() => {
        getItems(setLoading, setCategorias, 'categorias')
    }, [])

    const generalActions = [
        {
            icon: <FaTrashCan />,
            label: 'eliminar categoria/s',
            condition: (numSelected) => numSelected > 0 && permisoEliminarProductos,
            action: (selected) => setDesactivar(selected)
        },
        {
            label: 'Crear nueva categoria',
            condition: () => true,
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
        }
    ]


    if (loading)
        return (<CircularProgress size='4rem'
            sx={{
                position: 'relative',
                top: '50%',
                left: '40%',
                color: '#6AD096'
            }} />)
    else return (
        <>

            <AlertDialog
                open={desactivar ? true : false}
                contentText={desactivar ? `Seguro deseas eliminar ${desactivar.length > 1 ? `estas ${desactivar.length} categorias` : 'este categoria'}` : ''}
                cancelText='Cancelar'
                acceptText='Eliminar'
                acceptAction={() => {
                    const payload = { categorias: desactivar }
                    axiosClient.post('/desactivate-categorias', payload)
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
                            getItems(setLoading, setCategorias, 'categorias')
                        }).catch(err => {
                            console.log('Error en la respues al desabilitar las categorias: ' + err)
                        })
                }}
                cancelAction={() => setDesactivar(null)}
            />

            <RightDrawer
                width={'30vw'}
                open={formOpen}
                content={
                    <AddCategoria
                        setOpen={setFormOpen}
                        categorias={categorias}
                    />
                }
            />

            <div className='CatalogoContainer'>
                <div className='catalogo'>
                    <Table
                        pagination={false}
                        rows={formatColumnsTable(categorias, { 'label': 'Nombre', 'value': 'id' })}
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