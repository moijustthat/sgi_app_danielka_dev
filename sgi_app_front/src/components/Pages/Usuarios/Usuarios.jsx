import React from 'react'
import BasicTabs from '../../Common/BasicTabs/BasicTabs'
import Clientes from './Clientes/Clientes'
import Empleados from './Empleados/Empleados'
import { AiOutlineProduct } from "react-icons/ai";
import { useStateContext } from '../../../Contexts/ContextProvider';

const Usuarios = () => {

  const {getPermisos} = useStateContext()
    const permisos = getPermisos()
    const permisoClientes =  permisos.find(p=>p.moduloId == 29) && permisos.find(p=>p.moduloId == 29).estado === 't' ? true : false 
    const permisoEmpleados =  permisos.find(p=>p.moduloId == 25) && permisos.find(p=>p.moduloId == 25).estado === 't' ? true : false 




  return (
    <BasicTabs
        features={[
            {
                label: 'Clientes',
                component: permisoClientes ? <Clientes /> : <h2>No tienes permisos para usar este modulo</h2>,
                icon: <AiOutlineProduct />
            },
            {
                label: 'Empleados',
                component: permisoEmpleados ? <Empleados /> : <h2>No tienes permisos para usar este modulo</h2>,
                icon: <AiOutlineProduct />
            }
        ]}
    />
  )
}

export default Usuarios