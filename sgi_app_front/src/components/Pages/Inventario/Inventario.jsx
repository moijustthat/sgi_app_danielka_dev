import React, { useState, useEffect } from 'react'
import BasicTabs from '../../Common/BasicTabs/BasicTabs'
import Productos from './Productos/Productos'
import Categorias from './Categorias/Categorias';
import Marcas from './Marcas/Marcas'
import Unidades_Medida from './Unidades_Medida/Unidades_Medida'
import Proveedores from './Proveedores/Proveedores'
import { MdOutlineCategory } from "react-icons/md";
import { TbBrandBilibili } from "react-icons/tb";
import { TbRulerMeasure } from "react-icons/tb";
import axiosClient from '../../../axios-client';
import { AiOutlineProduct } from "react-icons/ai";
import { CircularProgress } from '@mui/material';
import { IoStorefrontOutline } from "react-icons/io5";
import { MdOutlineWarehouse } from "react-icons/md";
import Almacenes from '../Existencias/Almacenes/Almacenes';
import { useStateContext } from '../../../Contexts/ContextProvider';

const Inventario = () => {

  const {getPermisos} = useStateContext()
  const permisos = getPermisos()

  const permisoBodega =  permisos.find(p=>p.moduloId == 21) && permisos.find(p=>p.moduloId == 21).estado === 't' ? true : false 
  const permisoSalida =  permisos.find(p=>p.moduloId == 23) && permisos.find(p=>p.moduloId == 23).estado === 't' ? true : false 

  return (
    <BasicTabs
        features={[
            {
                label: 'Catalogo',
                component: <Productos />,
                icon: <AiOutlineProduct />
            },
            {
              label: 'Proveedores',
              component: <Proveedores />,
              icon: <IoStorefrontOutline />
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

export default Inventario