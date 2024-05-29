import React from 'react'
import BasicTabs from '../../Common/BasicTabs/BasicTabs'
import { MdOutlineWarehouse } from "react-icons/md";
import Almacenes from './Almacenes/Almacenes';
import { LuClipboardCopy } from "react-icons/lu";
import { LuClipboardPaste } from "react-icons/lu";
import Entradas from './Entradas/Entradas';
import Salidas from './Salidas/Salidas';

const Existencias = () => {
    return (
      <BasicTabs
          features={[
              {
                label: 'Entradas',
                component: <Entradas />,
                icon: <LuClipboardCopy />
              },
              {
                label: 'Salidas',
                component: <Salidas />,
                icon: <LuClipboardPaste />
              },
              {
                  label: 'Almacenes',
                  component: <Almacenes />,
                  icon: <MdOutlineWarehouse />
              }
          ]}
      />
    )
  }
  
  export default Existencias