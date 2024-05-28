import React from 'react'
import BasicTabs from '../../Common/BasicTabs/BasicTabs'
import Clientes from './Clientes/Clientes'
import Empleados from './Empleados/Empleados'
import { AiOutlineProduct } from "react-icons/ai";

const Usuarios = () => {
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