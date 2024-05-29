import React, { useEffect, useState } from 'react'
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

const Categorias = () => {
    const [loading, setLoading] = useState(false)
    const [marcas, setMarcas] = useState([])
    const [edit, setEdit] = useState(false)
    const [formOpen, setFormOpen] = useState(false)

    useEffect(()=>{
        getItems(setLoading, setMarcas, 'marcas')
    }, [])

    const generalActions = [
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