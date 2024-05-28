import React from 'react'
import BasicTabs from '../../Common/BasicTabs/BasicTabs'
import Productos from './Productos/Productos'

import { AiOutlineProduct } from "react-icons/ai";
const Inventario = () => {
  return (
    <BasicTabs
        features={[
            {
                label: 'Productos',
                component: <Productos />,
                icon: <AiOutlineProduct />
            }
        ]}
    />
  )
}

export default Inventario