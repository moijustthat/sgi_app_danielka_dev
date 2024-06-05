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
import { IoPeopleOutline } from "react-icons/io5";
import { FaPeopleRoof } from "react-icons/fa6";
import { colorMoney, colorCommas, colorNullToZero, cleanTable } from '../../../../utils/HandleTable'
import CardView from '../../../Common/CardViews/CardView'
import FormMayoristas from './FormMayoristas'
import FormComerciales from './FormComerciales'

const Clientes = () => {
    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(null)
    const [formOpen, setFormOpen] = useState(false)
    const [desactivar, setDesactivar] = useState(null)
    const [columnas, setColumnas] = useState([])
    const [clientes, setClientes] = useState([])
    const [clientesComerciales, setClientesComerciales] = useState([])
    const [clientesMayoristas, setClientesMayoristas] = useState([])
    const [tipos, setTipos] = useState({
        comerciales: true,
        mayoristas: false
    })

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
            icon: <IoPeopleOutline />,
            label: 'Clientes comerciales',
            condition: () => true,
            action: () => setTipos({
                mayoristas: false,
                comerciales: true
            })
        },
        {
            icon: <FaPeopleRoof />,
            label: 'Clientes mayoristas',
            condition: () => true,
            action: () => setTipos({
                mayoristas: true,
                comerciales: false
            })
        },
        {
            icon: <h5>{tipos.mayoristas ? 'Mayoristas' : 'Comerciales'}</h5>,
            label: 'Tipos de clientes',
            condition: () => true,
            action: () => null
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

    const getClientesComerciales = async () => {
        setLoading(true)
        axiosClient.get('/clientes/comerciales')
            .then(({data})=>{
                const clientesComerciales = data.clientes
                console.log(clientesComerciales)
                setClientesComerciales(clientesComerciales)
                setLoading(false)
            })
            .catch(error=>{
                console.log(error)
                setLoading(false)
            })
    }

    const getClientesMayoristas = async () => {
        setLoading(true)
        axiosClient.get('/clientes/mayoristas')
            .then(({data})=>{
                const clientesMayoristas = data.clientes
                console.log(clientesMayoristas)
                setClientesMayoristas(clientesMayoristas)
                setLoading(false)
            })
            .catch(error=>{
                console.log(error)
                setLoading(false)
            })
    }

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
            console.log(messageErr)
            setLoading(false)
        })  
  
    }

    useEffect(() => {
        getClientes()
        getClientesComerciales()
        getClientesMayoristas()
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

                    <FormDialog 
                        open={edit!==null}
                        setOpen={setEdit}
                        title='Editar cliente'
                        content={tipos.mayoristas ? <FormMayoristas id={edit} close={()=>setEdit(null)}/> : <FormComerciales id={edit} close={()=>setEdit(null)}/>}
                    />

                    <RightDrawer 
                    width={'30vw'} 
                    open={formOpen}
                    content={
                        <AddCliente
                            clientes={clientes}
                            setOpen={setFormOpen}
                            refresh={()=>{
                                getClientes()
                                getClientesComerciales()
                                getClientesMayoristas()
                            }}
                        />}
                    />

                <div className='CatalogoProductos'>
                    <div className='catalogo'>
                        <Table 
                            dense={true}
                            pagination={true}
                            empty={<CardView type='box'    style={{
                            marginLeft: '35%',
                            width: '30%',
                            height: '100%'
                            }} text='No tienes clientes en el sistema'/>}
                            generalActions={generalActions}
                            actions={actions}
                            setEdit={setEdit}
                            rows={tipos.mayoristas ? cleanTable(colorMoney(colorCommas(colorNullToZero(clientesMayoristas, ['Importe comprado', 'Pagado', 'Debido']), ['Importe comprado', 'Pagado', 'Debido']), ['Importe comprado', 'Pagado', 'Debido'])) : cleanTable(colorMoney(colorCommas(colorNullToZero(clientesComerciales, ['Importe comprado', 'Pagado', 'Debido']), ['Importe comprado', 'Pagado', 'Debido']), ['Importe comprado', 'Pagado', 'Debido']))}
                            setRows={setClientes}
                        />
                    </div>
                </div>
            </>
}

export default Clientes