import { useState, useEffect } from 'react'
import './Ordenes.css'
import Table from '../../../Common/Table/Table'
import RightDrawer from '../../../Common/RightDrawer/RightDrawer'
import { UilInvoice } from '@iconscout/react-unicons'
import CreateInvoice from './CreateInvoice'
import CircularProgress from '../../../Common/CircularProgess/CircularProgress'
import axiosClient from '../../../../axios-client'
import CardView from '../../../Common/CardViews/CardView'
import FormDialog from '../../../Common/FormDialog/FormDialog'
import { getOrdenes } from '../LoadData/LoadData'
import { UilTimes } from '@iconscout/react-unicons'
import { AiOutlineDollarCircle } from "react-icons/ai";
import { AiTwotonePrinter } from "react-icons/ai";
import { UilEye } from '@iconscout/react-unicons';
import { FaRegEdit } from "react-icons/fa";
import { colorStates, colorStatesEntrega } from '../../../../utils/HandleTable'
import { colorMoney, colorCommas } from '../../../../utils/HandleTable'
import { useStateContext } from '../../../../Contexts/ContextProvider'
import { FaTruck } from "react-icons/fa";
import AlertDialog from '../../../Common/AlertDialog/AlertDialog'
import FormOrden from './FormOrden'

// Pa generar el pdf
import { renderToString } from 'react-dom/server'
import { jsPDF } from 'jspdf'
import html2pdf from 'html2pdf.js'
import OrdenTemplate from './OrdenTemplate'
import FullScreenDialog from '../../../FullDialog/FullDialog'

import { filterColumns } from '../../../../utils/HandleTable'

//FaRegEye
const Ordenes = () => {

    const { getPermisos } = useStateContext()
    const permisos = getPermisos()
    const permisoCrearOrdenes = permisos.find(p => p.moduloId == 2) && permisos.find(p => p.moduloId == 2).estado === 't' ? true : false
    const permisoLeerOrdenes = permisos.find(p => p.moduloId == 3) && permisos.find(p => p.moduloId == 3).estado === 't' ? true : false

    const [loading, setLoading] = useState(false)
    const [openForm, setFormOpen] = useState(false)

    // Datos a pedir a la bd
    const [ordenes, setOrdenes] = useState([])
    const [proveedores, setProveedores] = useState([])
    const [productos, setProductos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [marcas, setMarcas] = useState([])
    const [unidades_medida, setUnidadesMedida] = useState([])
    const [currentOrden, setCurrentOrden] = useState({ id: null, detalles: null })
    const [openDetails, setOpenDetails] = useState(false)
    const [details, setDetails] = useState(null)
    const [edit, setEdit] = useState(null)
    const [cancelar, setCancelar] = useState(null)
    const [activar, setActivar] = useState(null)

    const showAbonos = (id) => {
        axiosClient.get(`/abonos/orden/${id}`)
            .then(({data})=> {
                const abonos = data.abonos
                console.log(abonos)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    const showDetails = (id) => {
        if (currentOrden.id !== id) {
            axiosClient.get(`/orden/${id}`)
                .then(({ data }) => {
                    const orden = ordenes.find(o => o.id === id)
                    const detalles = data.orden
                    console.log(detalles)
                    setCurrentOrden({ id: id, detalles: detalles })
                    const factura = <OrdenTemplate
                        orden={orden}
                        detalles={detalles}
                        actions={false}
                    />
                    setDetails(factura)
                    setOpenDetails(true)
                })
                .catch(error => {
                    console.log(error)
                })
        } else {
            const orden = ordenes.find(o => o.id === currentOrden.id)
            const detalles = currentOrden.detalles
            const factura = <OrdenTemplate orden={orden} detalles={detalles} />
            setDetails(factura)
            setOpenDetails(true)
        }
    }

    const generateOrdenPDF = (id) => {
        if (currentOrden.id !== id) {
            axiosClient.get(`/orden/${id}`)
                .then(({ data }) => {
                    const orden = ordenes.find(o => o.id === id)
                    const detalles = data.orden
                    setCurrentOrden({ id: id, detalles: detalles })
                    console.log(orden)
                    console.log(detalles)
                    /*const factura = renderToString(<OrdenTemplate orden={orden} detalles={detalles}/>)
                    const doc = new jsPDF()
                    doc.save(factura, {
                        callback: function (pdf) {
                            pdf.output('dataurlnewwindow')
                        },
                        x: 1,
                        y: 1
                    })*/
                })
                .catch(error => {
                    console.log(error)
                })
        } else {
            alert('memo')
            const orden = ordenes.find(o => o.id === currentOrden.id)
            const detalles = currentOrden.detalles
            setCurrentOrden({ id: id, detalles: detalles })
            console.log(orden)
            console.log(detalles)
            /*const factura = renderToString(<OrdenTemplate orden={orden} detalles={detalles}/>)
            const doc = new jsPDF()
            doc.save(factura, {
                callback: function (pdf) {
                    pdf.output('dataurlnewwindow')
                },
                x: 1,
                y: 1
            })*/
        }

    }

    const generalActions = [
        {
            icon: <UilInvoice />,
            label: 'Nueva Orden',
            condition: () => permisoCrearOrdenes,
            action: () => setFormOpen(true)
        }
    ]

    const actions = [
        {
            label: 'Ver detalles',
            icon: <UilEye />,
            action: (id) => showDetails(id)
        },
        {
            label: 'Recibir orden',
            icon: <FaTruck />,
            action: (id) => alert('La orden ya llego!!')
        },
        {
            label: 'Abonar',
            icon: <AiOutlineDollarCircle />,
            action: (id) => showAbonos(id)
        }
    ]

    const getProveedores = () => {
        setLoading(true)
        axiosClient.get('/proveedores')
            .then(({ data }) => {
                const response = data.data
                const formatedProveedores = []
                for (let proveedor of response) {
                    formatedProveedores.push({ label: proveedor['Razon Social'], value: proveedor['id'], info: proveedor })
                }
                setProveedores(formatedProveedores)
                setLoading(false)
            })
            .catch(error => {
                console.log(error)
                setLoading(false)
            })
    }

    const getProductos = () => {
        setLoading(true)
        axiosClient.get('/productos')
            .then(({ data }) => {
                const response = data.data
                const formatedProductos = []
                for (let producto of response) {
                    formatedProductos.push({ label: producto['Nombre'], value: producto['id'], info: producto })
                }
                setProductos(formatedProductos)
                setLoading(false)
            })
            .catch(error => {
                console.log(error)
                setLoading(false)
            })
    }

    const getItems = async () => {
        setLoading(true)
        axiosClient.get('/seleccionables')
            .then(({ data }) => {
                setCategorias(data.categorias.map((categoria, index) => {
                    return {
                        label: categoria.nombre,
                        value: categoria.categoriaId
                    }
                }))
                setMarcas(data.marcas.map((marca, index) => {
                    return {
                        label: marca.nombre,
                        value: marca.marcaId
                    }
                }))
                setUnidadesMedida(data.unidades_medida.map((medida, index) => {
                    return {
                        label: medida.nombre,
                        value: medida.unidadMedidaId
                    }
                }))
                setLoading(false)
            })
            .catch((e) => {
                console.log('Error en la respuesta: ' + e);
                setLoading(false)
            })
    }

    useEffect(() => {
        getOrdenes(setLoading, setOrdenes)
        getProveedores()
        getProductos()
        getItems()
    }, [])

    if (loading) return <CircularProgress />
    else if (openDetails) return (<FullScreenDialog
        content={details}
        refreshState={() => setOpenDetails(false)}
    />)
    else return (
        <>
            <div className='ListaOrdenes'>

                <FormDialog
                    open={edit !== null}
                    setOpen={setEdit}
                    title='Estado de la orden'
                    content={<FormOrden id={edit} close={() => setEdit(null)} />}
                />


                <AlertDialog
                    open={cancelar ? true : false}
                    title='Cancelar orden?'
                    contentText={cancelar ? `Seguro deseas cancelar esta orden?` : ''}
                    cancelText='No cancelar'
                    acceptText='Cancelar'
                    acceptAction={() => {
                        const payload = { id: cancelar }
                        axiosClient.post('/cancelar/orden', payload)
                            .then(({ data }) => {
                                const response = data.message
                                alert(response)
                                setCancelar(null)
                                getOrdenes(setLoading, setOrdenes)
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    }}
                    cancelAction={() => setCancelar(null)}
                />

                <AlertDialog
                    open={activar ? true : false}
                    title='Restituir orden'
                    contentText={activar ? `Seguro deseas volver a activar esta orden?` : ''}
                    cancelText='Cancelar'
                    acceptText='Aceptar'
                    acceptAction={() => {
                        const payload = { id: activar }
                        axiosClient.post('/activar/orden', payload)
                            .then(({ data }) => {
                                const response = data.message
                                alert(response)
                                setActivar(null)
                                getOrdenes(setLoading, setOrdenes)
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    }}
                    cancelAction={() => setActivar(null)}
                />


                <RightDrawer
                    width={'100vw'}
                    content={
                        <CreateInvoice
                            setOpen={setFormOpen}
                            proveedores={proveedores}
                            productos={productos}
                            categorias={categorias}
                            marcas={marcas}
                            refresh={() => getOrdenes(setLoading, setOrdenes)}
                            unidades_medida={unidades_medida}
                        />
                    }
                    open={openForm} />
                <div className='ordenes'>
                    <Table
                        pagination={true}
                        dense={true}
                        rows={permisoLeerOrdenes ? filterColumns(colorStatesEntrega((id)=>{}, colorStates((id) => setCancelar(id), (id) => setActivar(id), colorMoney(colorCommas(ordenes, ['Subtotal', 'Descuento', 'Cargos por mora', 'Total', 'Pagado', 'Debido']), ['Subtotal', 'Descuento', 'Cargos por mora', 'Total', 'Pagado', 'Debido']))), ['Fecha emision']) : []}
                        empty={<CardView type='shopping' text={permisoLeerOrdenes ? 'Realiza compras a tus proveedores para llenar tu inventario' : 'No tienes permisos para este modulo 😔'} style={{
                            marginLeft: '35%',
                            width: '30%',
                            height: '100%'
                        }} />}
                        generalActions={generalActions}
                        actions={actions}

                    />
                </div>

            </div>
        </>
    )
}

export default Ordenes