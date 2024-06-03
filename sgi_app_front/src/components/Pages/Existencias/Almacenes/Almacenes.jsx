import '../../../Common/MainModuleCss/MainModule.css'
import React, {useEffect, useState} from 'react'
import BasicTable from '../../../Common/Table/Table'
import { UilCreateDashboard } from '@iconscout/react-unicons'
import RightDrawer from '../../../Common/RightDrawer/RightDrawer'
import AddAlmacen from './AddAlmacen'
import { CircularProgress } from '@mui/material'
import { formatColumnsTable } from '../../../../utils/HandleTable'
import {getAlmacenes} from '../LoadData/LoadData'
import { TfiExchangeVertical } from "react-icons/tfi";
import AlertDialog from '../../../Common/AlertDialog/AlertDialog'
import AlterPrioridadBusqueda, {textAlterPrioridadBusqueda} from './Helpers/AlterPrioridadBusqueda'

const Almacenes = () => {

    const [formOpen, setFormOpen] = useState(false)
    const [almacenes, setAlmacenes] = useState([])
    const [loading, setLoading] = useState(false)

    const [alterOrder, setAlterOrder] = useState(null)

    const generalActions = [
        {
            label: 'Crear nuevo almacen',
            icon: <UilCreateDashboard />,
            condition: () => true,
            action: () => setFormOpen(true)
        },
        {
            label: 'Alternar prioridad de busqueda',
            icon: <TfiExchangeVertical />,
            condition: (numSelected) => numSelected == 2,
            action: (selected) => setAlterOrder(selected)
        }
    ]

    useEffect(()=>{
        getAlmacenes(setLoading, setAlmacenes)
    }, [])

    if (loading) return <CircularProgress size='4rem'
                sx={{
                position: 'relative',
                top:'50%',
                left: '40%',
                color: '#6AD096'
                }}
            />
    else return (
        <>

        <AlertDialog 
            open={alterOrder ? true : false}
            contentText={alterOrder ? textAlterPrioridadBusqueda(alterOrder[0], alterOrder[1], almacenes) : ''}
            cancelAction={()=>setAlterOrder(null)}
            acceptAction={alterOrder ? () => AlterPrioridadBusqueda(alterOrder[0], alterOrder[1], almacenes) : ()=>null}
        />

            <RightDrawer 
                open={formOpen}
                width={'30vw'}
                content={<AddAlmacen 
                            setOpen={setFormOpen}
                            almacenes={almacenes}
                        />}
                setOpen={setFormOpen}
            />


            <div className='CatalogoContainer'>
                <div className='catalogo'>
                    <BasicTable 
                        pagination={false}
                        generalActions={generalActions}
                        empty={<h1>Buscar svg bonito</h1>}
                        rows={almacenes}
                    />
                </div>
            </div>
        </>
    )
}

export default Almacenes