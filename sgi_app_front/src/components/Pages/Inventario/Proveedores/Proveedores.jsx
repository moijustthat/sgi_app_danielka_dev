import '../../../Common/MainModuleCss/MainModule.css'
import React, {useState, useEffect} from 'react'
import TableProveedores from '../../../Common/Table/Table'
import { CircularProgress } from '@mui/material'
import { getProveedores } from '../LoadData/LoadData'
import RightDrawer from '../../../Common/RightDrawer/RightDrawer'
import AddProveedores from './AddProveedores'
import { UilStore } from '@iconscout/react-unicons'

const Proveedores = () => {

    const [loading, setLoading] = useState(false)
    const [proveedores, setProveedores] = useState([])
    const [formOpen, setFormOpen] = useState(false)

    useEffect(()=>{
        getProveedores(setLoading, setProveedores)
    }, [])

    const generalActions = [
        {
            label: 'Registrar nuevo proveedor',
            icon: <UilStore />,
            condition: () => true,
            action: () => setFormOpen(true)
        }
    ]


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
            <RightDrawer 
                open={formOpen}
                width={'30vw'}
                content={<AddProveedores 
                            proveedores={proveedores}
                            setOpen={setFormOpen}
                        />}
                setOpen={setFormOpen}
            />

            <div className='CatalogoContainer'>
                <div className='catalogo'>
                    <TableProveedores 
                        rows={proveedores}
                        generalActions={generalActions}
                    />
                </div>
            </div>
        </>
    )
}

export default Proveedores