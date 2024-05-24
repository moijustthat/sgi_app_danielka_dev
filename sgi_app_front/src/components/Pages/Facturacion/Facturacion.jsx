import React from 'react'
import BasicTabs from '../../Common/BasicTabs/BasicTabs';
import Ordenes from './Ordenes/Ordenes';

import { UilBill } from '@iconscout/react-unicons'

const Inventario = () => {
  return (
    <BasicTabs
        features={[
            {
                label: 'Ordenes',
                component: <Ordenes />,
                icon: <UilBill />
            }
        ]}
    />
  )
}

export default Inventario