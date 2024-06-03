import { useEffect, useState, useContext } from 'react'
import Banner from '../../../Common/Banner/Banner'
import Table from '../../../Common/Table/Table'
import RightDrawer from '../../../Common/RightDrawer/RightDrawer'
import './Empleados.css'
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
import { UilColumns } from '@iconscout/react-unicons'
import CheckMenu from '../../../Common/CheckMenu/CheckMenu'
import CircularProgress from '@mui/material/CircularProgress';
import AlertDialog from '../../../Common/AlertDialog/AlertDialog'
import AddEmpleado from './AddEmpleado'
import { IoSettingsOutline } from "react-icons/io5";
import FormDialog from '../../../Common/FormDialog/FormDialog'
import Permisos from './Permisos/Permisos'

import CardView from '../../../Common/CardViews/CardView'

import { useStateContext } from '../../../../Contexts/ContextProvider'

const Clientes = () => {
    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(null)
    const [all, setAll] = useState(null)
    const [administrador, setAdministrador] = useState(null)
    const [controlador, setControlador] = useState(null)
    const [vendedor, setVendedor] = useState(null)
    const [bodeguero, setBodeguero] = useState(null)
    const [permisos, setPermisos] = useState(false)
    const [formOpen, setFormOpen] = useState(false)
    const [desactivar, setDesactivar] = useState(null)
    const [columnas, setColumnas] = useState([])
    const [empleados, setEmpleados] = useState([])
    const [cargos, setCargos] = useState([])

    const {getUser} = useStateContext()
    const user = getUser()

    const generalActions = [
        {
            icon: <UilStopCircle />,
            label: 'desactivar-producto/s',
            condition: (numSelected) => numSelected > 0,
            action: (selected) => setDesactivar(selected)
        },
        {
            icon: <IoSettingsOutline />,
            label: 'permisos',
            condition: () => user.cargoId === 135,
            action: () => setPermisos(true)
            
        },
        {
            icon: <UilPlus />,
            label: 'Nuevo empleado',
            condition: () => true,
            action: () => setFormOpen(true)
        },
        {
            icon: <UilFilter />,
            label: 'Filtrar producos',
            condition: () => true,
            action: () => alert('Filtrar Productos')
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

    const getPermisos = async () => {
        setLoading(true)
        axiosClient.get('/permisos')
            .then(({data}) => {
                const permisos = data.permisos
                setAll(permisos.all)

                // Crear checks
                for (let permiso of permisos.administrador) {
                    permiso.check = true
                }
                setAdministrador(permisos.administrador)

                for (let permiso of permisos.controlador) {
                    permiso.check = true
                }
                setControlador(permisos.controlador)

                for (let permiso of permisos.vendedor) {
                    permiso.check = true
                }
                setVendedor(permisos.vendedor)

                for (let permiso of permisos.bodeguero) {
                    permiso.check = true
                }
                setBodeguero(permisos.bodeguero)
                setLoading(false)
            })
            .catch((e) => {
                console.log('Error en la respuesta: '+e);
                setLoading(false)
            }) 
    }

    const getCargos = async () => {
        setLoading(true)
        axiosClient.get('/cargos')
          .then(({data}) => {
            const cargos = data.data
            setCargos(cargos.map(cargo=>({
                value: cargo.cargoId,
                label: cargo.nombre
            })))
            setLoading(false)
          })
          .catch((e) => {
            console.log('Error en la respuesta: '+e);
            setLoading(false)
          }) 
      }

    const getEmpleados = async () => {
        setLoading(true)
        axiosClient.get('/empleados')
        .then(({data}) => {
            const empleados = data.data
            const columnas = empleados.length > 0 ? Object.keys(empleados[0]) : []
            const unchecked = ['Nombre', 'Apellido', 'Cargo', 'Telefono', 'Correo']
            const state = []
            for (let columna of columnas) {
              state.push({label: columna, checked: unchecked.findIndex(u=>u==columna) != -1 ? false : true})
            }
            setColumnas(state)
            setEmpleados(empleados)
            setLoading(false)
        })
        .catch(error=> {
            const messageErr = error.response.data.messageError
            setLoading(false)
        })  
  
    }

    useEffect(() => {
        getCargos()
        getPermisos()
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
                        <AddEmpleado
                            cargos={cargos}
                            setOpen={setFormOpen}
                        />}
                    />

                <FormDialog 
                    open={permisos}
                    setOpen={()=>setPermisos(false)}
                    content={<Permisos
                            all={all}
                            setAll={setAll}
                            administrador={administrador}
                            setAdministrador={setAdministrador}
                            controlador={controlador}
                            setControlador={setControlador}
                            vendedor={vendedor}
                            setVendedor={setVendedor}
                            bodeguero={bodeguero}
                            setBodeguero={setBodeguero}
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
                            }} text='No tienes empleados en el sistema'/>}
                            generalActions={generalActions}
                            actions={actions}
                            setEdit={setEdit}
                            rows={empleados}
                            setRows={setEmpleados}
                        />
                    </div>
                </div>
            </>
}

export default Clientes