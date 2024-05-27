import React from 'react'
import BasicTabs from '../../Common/BasicTabs/BasicTabs';
import Ordenes from './Ordenes/Ordenes';
import Ventas from './Ventas/Ventas';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import { UilBill } from '@iconscout/react-unicons'

const Inventario = () => {
  return (
    <BasicTabs
        features={[
            {
                label: 'Ordenes',
                component: <Ordenes />,
                icon: <UilBill />
            },
            {
              label: 'Ventas',
              component: <Ventas />,
              icon: <SellOutlinedIcon />
          }
        ]}
    />
  )
}

export default Inventario