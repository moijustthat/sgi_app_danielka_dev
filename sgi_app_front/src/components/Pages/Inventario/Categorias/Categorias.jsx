import React, { useEffect, useState } from 'react'
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

const Categorias = () => {
    const [loading, setLoading] = useState(false)
    const [categorias, setCategorias] = useState([])
    const [edit, setEdit] = useState(false)
    const [formOpen, setFormOpen] = useState(false)

    useEffect(()=>{
        getItems(setLoading, setCategorias, 'categorias')
    }, [])

    const generalActions = [
        {
            label: 'Crear nueva categoria',
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
                        rows={formatColumnsTable(categorias, {'label': 'Nombre', 'value': 'id'})}
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