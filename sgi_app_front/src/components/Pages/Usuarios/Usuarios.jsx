import React from 'react'
import BasicTabs from '../../Common/BasicTabs/BasicTabs'
import Clientes from './Clientes/Clientes'
import Empleados from './Empleados/Empleados'
import { AiOutlineProduct } from "react-icons/ai";
import { useStateContext } from '../../../Contexts/ContextProvider';

const Usuarios = () => {

  const {getPermisos} = useStateContext()
    const permisos = getPermisos()
    console.log(permisos)

  return (
    <BasicTabs
        features={[
            {
                label: 'Clientes',
                component: <Clientes />,
                icon: <AiOutlineProduct />
            },
            {
                label: 'Empleados',
                component: <Empleados />,
                icon: <AiOutlineProduct />
            }
        ]}
    />
  )
}

export default Usuarios