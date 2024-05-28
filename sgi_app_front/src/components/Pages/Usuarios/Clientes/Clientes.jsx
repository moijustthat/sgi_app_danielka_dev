import { useEffect, useState, useContext } from 'react'
import Banner from '../../../Common/Banner/Banner'
import Table from '../../../Common/Table/Table'
import RightDrawer from '../../../Common/RightDrawer/RightDrawer'
import './Clientes.css'
import { UilPlus } from '@iconscout/react-unicons'
import { UilFilter } from '@iconscout/react-unicons'
import { UilStopCircle } from '@iconscout/react-unicons'
import { UilEdit } from '@iconscout/react-unicons'
import { UimCheckCircle } from '@iconscout/react-unicons-monochrome'
import { UilEye } from '@iconscout/react-unicons'
import hexToDataURL, { isHex, base64ToHex } from '../../../../utils/HexToDataUrl'
import axiosClient from '../../../../axios-client'
import { Avatar } from '@mui/material'
import {NotificationContext} from '../../../Notifications/NotificationProvider'
import { v4, validate } from 'uuid'
import DBParser from '../../../../utils/DbFieldsConverter'
import validateAPI from '../../../../utils/textValidation'
import Resume from '../../../Common/Resume/Resume.'
import FormDialog from '../../../Common/FormDialog/FormDialog'
import { UilColumns } from '@iconscout/react-unicons'
import CheckMenu from '../../../Common/CheckMenu/CheckMenu'
import CircularProgress from '@mui/material/CircularProgress';
import AlertDialog from '../../../Common/AlertDialog/AlertDialog'
import AddCliente from './AddCliente'

import CardView from '../../../Common/CardViews/CardView'

const Clientes = () => {
    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(null)
    const [formOpen, setFormOpen] = useState(false)
    const [desactivar, setDesactivar] = useState(null)
    const [columnas, setColumnas] = useState([])
    const [clientes, setClientes] = useState([])

    const generalActions = [
        {
            icon: <UilStopCircle />,
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

    const getClientes = async () => {
        setLoading(true)
        axiosClient.get('/clientes')
        .then(({data}) => {
            const clientes = data.data
            const columnas = clientes.length > 0 ? Object.keys(clientes[0]) : []
            const unchecked = ['Nombre', 'Apellido', 'Tipo', 'Telefono', 'Correo']
            const state = []
            for (let columna of columnas) {
              state.push({label: columna, checked: unchecked.findIndex(u=>u==columna) != -1 ? false : true})
            }
            setColumnas(state)
            setClientes(clientes)
            setLoading(false)
        })
        .catch(error=> {
            const messageErr = error.response.data.messageError
            setLoading(false)
        })  
  
    }

    useEffect(() => {
        //getClientes()
    }, [])

    if (loading) {
        return <CircularProgress 
                size='4rem'
                sx={{
                  position: 'relative',
                  top:'50%',
                  left: '40%',
                  color: '#6AD096'
                }}/>
      }

    return  <>

                    <RightDrawer 
                    width={'30vw'} 
                    open={formOpen}
                    content={
                        <AddCliente
                            clientes={clientes}
                            setOpen={setFormOpen}
                        />}
                    />

                <div className='CatalogoProductos'>
                    <div className='catalogo'>
                        <Table 
                            dense={true}
                            pagination={false}
                            empty={<CardView type='box'    style={{
                            marginLeft: '35%',
                            width: '30%',
                            height: '100%'
                            }} text='No tienes clientes en el sistema'/>}
                            generalActions={generalActions}
                            actions={actions}
                            setEdit={setEdit}
                            rows={clientes}
                            setRows={setClientes}
                        />
                    </div>
                </div>
            </>
}

export default Clientes