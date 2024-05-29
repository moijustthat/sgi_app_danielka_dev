import React, { useState, useEffect } from 'react'
import BasicTabs from '../../Common/BasicTabs/BasicTabs'
import Productos from './Productos/Productos'
import Categorias from './Categorias/Categorias';
import Marcas from './Marcas/Marcas'
import Unidades_Medida from './Unidades_Medida/Unidades_Medida'
import Proveedores from './Proveedores/Proveedores'
import Almacenes from './Almacenes/Almacenes'
import { MdOutlineCategory } from "react-icons/md";
import { TbBrandBilibili } from "react-icons/tb";
import { TbRulerMeasure } from "react-icons/tb";
import axiosClient from '../../../axios-client';
import { AiOutlineProduct } from "react-icons/ai";
import { CircularProgress } from '@mui/material';
import { IoStorefrontOutline } from "react-icons/io5";
import { MdOutlineWarehouse } from "react-icons/md";

const Inventario = () => {

  return (
    <BasicTabs
        features={[
            {
                label: 'Productos',
                component: <Productos />,
                icon: <AiOutlineProduct />
            },
            {
              label: 'Almacenes',
              component: <Almacenes />,
              icon: <MdOutlineWarehouse />
            },
            {
              label: 'Proveedores',
              component: <Proveedores />,
              icon: <IoStorefrontOutline />
            },
            {
              label: 'Categorias',
              component: <Categorias/>,
              icon: <MdOutlineCategory />
            },
            {
              label: 'Marcas',
              component: <Marcas/>,
              icon: <TbBrandBilibili />
            }, 
            {
              label: 'Unidades de medida',
              component: <Unidades_Medida/>,
              icon: <TbRulerMeasure />
            },
            
        ]}
    />
  )
}

export default Inventario