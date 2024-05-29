import '../../../Common/MainModuleCss/MainModule.css'
import React, { useState, useEffect } from 'react'
import EntradasTable from '../../../Common/Table/Table'
import RightDrawer from '../../../Common/RightDrawer/RightDrawer'
import { BsClipboard2Plus } from "react-icons/bs";
import {getEntradas, getProductos, getAllItems } from '../LoadData/LoadData';
import { CircularProgress } from '@mui/material';
import { filterColumns, cleanTable } from '../../../../utils/HandleTable'
import { UilEdit } from '@iconscout/react-unicons'
import { UilPlusCircle } from '@iconscout/react-unicons'
import { UilMinusCircle } from '@iconscout/react-unicons'
import AddEntrada from './AddEntrada';

const Entradas = () => {

    const [entradas, setEntradas] = useState([])
    const [almacenes, setAlmacenes] = useState([])
    const [categorias, setCategorias] = useState([])
    const [marcas, setMarcas] = useState([])
    const [unidades_medida, setUnidadesMedida] = useState([])
    const [productos, setProductos] = useState([])
    const [formOpen, setFormOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(false)

    const generalActions = [
        {
            label: 'Actualizar inventario',
            icon: <BsClipboard2Plus />,
            condition: () => true,
            action: () => setFormOpen(true)
        }
    ]

    const actions = [
        {
            label: 'Editar',
            icon: <UilEdit />,
            action: (id)=> setEdit(true)
        },
        {
            label: 'Agregar',
            icon: <UilPlusCircle />,
            action: (id)=>alert('agregar '+id)
        },
        {
            label: 'Agregar',
            icon: <UilMinusCircle />,
            action: (id)=>alert('Restar '+id)
        }
    ] 

    useEffect(()=>{
        getAllItems(setLoading, setCategorias, setMarcas, setUnidadesMedida, setAlmacenes)
        getEntradas(setLoading, setEntradas)
        getProductos(setLoading, setProductos)
    }, [])

    if (loading) return <CircularProgress size='4rem'
        sx={{
            position: 'relative',
            top: '50%',
            left: '40%',
            color: '#6AD096'
        }}
    />
    else return (
        <>
            <RightDrawer
                open={formOpen}
                width={'40vw'}
                content={<AddEntrada 
                            setOpen={setFormOpen}
                            productos={productos}
                            categorias={categorias}
                            marcas={marcas} 
                            unidades_medida={unidades_medida}
                            almacenes={almacenes}
                        />}
                setOpen={setFormOpen}
            />

            <div className='CatalogoContainer'>
                <div className='catalogo'>
                    <EntradasTable
                        dense={true}
                        pagination={false}
                        generalActions={generalActions}
                        actions={actions}
                        rows={filterColumns(cleanTable(entradas), ['categoriaId', 'productoId', 'proveedorId', 'empleadoId'])}
                    />
                </div>
            </div>
        </>
    )
}

export default Entradas