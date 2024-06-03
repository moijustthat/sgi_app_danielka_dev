import React from 'react'
import BasicTabs from '../../Common/BasicTabs/BasicTabs'
import { MdOutlineWarehouse } from "react-icons/md";
import Almacenes from './Almacenes/Almacenes';
import { LuClipboardCopy } from "react-icons/lu";
import { LuClipboardPaste } from "react-icons/lu";
import Entradas from './Entradas/Entradas';
import Salidas from './Salidas/Salidas';
import { useStateContext } from '../../../Contexts/ContextProvider';

const Existencias = () => {

  const {getPermisos} = useStateContext()
    const permisos = getPermisos()

    const permisoBodega =  permisos.find(p=>p.moduloId == 21) && permisos.find(p=>p.moduloId == 21).estado === 't' ? true : false 
    const permisoSalida =  permisos.find(p=>p.moduloId == 23) && permisos.find(p=>p.moduloId == 23).estado === 't' ? true : false 


    return (
      <BasicTabs
          features={[
              {
                label: 'Entradas',
                component: permisoBodega ? <Entradas /> : <h2>No tienes permisos para usar este modulo</h2>,
                icon: <LuClipboardCopy />
              },
              {
                label: 'Salidas',
                component: permisoSalida ? <Salidas /> : <h2>No tienes permisos para usar este modulo</h2>,
                icon: <LuClipboardPaste />
              },
              {
                  label: 'Almacenes',
                  component: permisoBodega ? <Almacenes /> : <h2>No tienes permisos para usar este modulo</h2>,
                  icon: <MdOutlineWarehouse />
              }
          ]}
      />
    )
  }
  
  export default Existencias