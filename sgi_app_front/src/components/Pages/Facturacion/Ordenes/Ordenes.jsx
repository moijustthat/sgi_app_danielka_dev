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
import { MdAttachMoney } from "react-icons/md";
import FullScreenDialog from '../../../FullDialog/FullDialog'
import ItemsTemplate from '../../../Common/ItemsTemplate/ItemsTemplate'
import {formatearNumeroConComas, formatearNumeroDinero, truncarDecimal} from '../../../../utils/textValidation'
import EntregaTemplate from '../EntregaTemplate/EntregaTemplate'

// Pa generar el pdf
import { renderToString } from 'react-dom/server'
import { jsPDF } from 'jspdf'
import html2pdf from 'html2pdf.js'
import OrdenTemplate from './OrdenTemplate'

import { filterColumns } from '../../../../utils/HandleTable'
import validateApi from '../../../../utils/textValidation'

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
    const [almacenes, setAlmacenes] = useState([])
    const [currentOrden, setCurrentOrden] = useState({ id: null, detalles: null })
    const [openDetails, setOpenDetails] = useState(false)
    const [details, setDetails] = useState(null)
    const [edit, setEdit] = useState(null)
    const [cancelar, setCancelar] = useState(null)
    const [activar, setActivar] = useState(null)
    const [abonos, setAbonos] = useState(null)
    const [entrada, setEntrada] = useState(null)

    
    const showAbonos = (id) => {
        axiosClient.get(`/abonos/orden/${id}`)
            .then(({ data }) => {
                const abonos = data.abonos
                const orden = ordenes.find(o => o.id === id)
                setAbonos({ orden: orden, abonos: abonos })
                
            })
            .catch(error => {
                console.log(error)
                
            })
    }

    const orderExecInput = (id) => {
        setLoading(true)
        axiosClient.get(`/entrada/orden/${id}`)
            .then(({ data }) => {
                const entrada = data.entrada
                const orden = ordenes.find(o => o.id === id)
                for (let e of entrada) {
                    const producto = productos.find(({info})=>String(info.id)===String(e.productoId)).info
                    e['Almacen'] = 'empty'
                    e['Fecha de vencimiento stock'] = producto['Caducidad'] === 't' ? '' : 'No caduca'
                }
                setEntrada({ orden: orden, entrada: entrada })
                setLoading(false)
            })
            .catch(error => {
                console.log(error)
                setLoading(false)
            })
    }

    const showDetails = (id) => {
        if (currentOrden.id !== id) {
            axiosClient.get(`/orden/${id}`)
                .then(({ data }) => {
                    const orden = ordenes.find(o => o.id === id)
                    const detalles = data.orden
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
            action: (id) => {
                const orden = ordenes.find(ord=>ord.id===id)
                orden['Estado entrega']==='Esperando' && orderExecInput(id)
            }
        },
        {
            label: 'Abonar',
            icon: <AiOutlineDollarCircle />,
            action: (id) => {
                const orden = ordenes.find(ord=>ord.id===id)
                orden['Estado']!=='cancelada' && showAbonos(id)
            }
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
                setAlmacenes(data.almacenes.map((almacen, index) => {
                    return {
                      label: almacen.nombre,
                      value: almacen.almacenId
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
    else if (entrada) {

        const debido = formatearNumeroDinero(entrada.orden['Debido'])

        const setInputs = (index, label, value) => {
            setEntrada(prev=>{
                const copyEntrada = {...prev}
                const entrada = copyEntrada.entrada
                entrada[index][label] = value
                return copyEntrada
            })
        }
        
        
        
    

        return <FullScreenDialog
                title='La orden ya llego!'
                refreshState={() => {
                    setEntrada(null)
                }}
                content={<EntregaTemplate
                    header={{
                        title: `Entrada de la orden #${entrada.orden['#Num']}`,
                        row1LeftLabel: 'Num stocks',
                        row1LeftValue: `${entrada.entrada.length}`,
                        row1RightLabel: 'Total a pagar',
                        row1RightValue: `C$ ${formatearNumeroDinero(entrada.orden['Total'])}`,
                        row2LeftLabel: 'Importe debido',
                        row2LeftValue: Number(debido)===0?<div style={{width: '300px', color: '#FFF', background:'#4CBDA3', borderRadius: '5px'}}>Orden pagada</div>:`C$ ${debido}`,
                        row2RightLabel: 'Fecha limite de pago',
                        row2RightValue: entrada.orden['Fecha limite de pago'] || 'Sin fecha fimite',
                    }}
                    data={entrada.entrada}
                    rows={filterColumns(entrada.entrada, ['ordenId', 'productoId', 'id'])}
                    setRows={setInputs}
                    almacenes={almacenes}
                    footer={[{ label: 'Total abonado', value: 'C$ ' + formatearNumeroDinero(entrada.orden['Pagado']) }]}
                />}
            />
    }
    else if (abonos) {

        const abonosInput = [
            {
                label: 'Monto',
                type: 'text',
                validate: (value) => {
                    const overPayment = Number(abonos.orden['Debido']) < Number(value)
                    return validateApi.positiveReal(value) && validateApi.priceTruncated(value) && !!!overPayment
                }
            }
        ]

        const debido = formatearNumeroDinero(abonos.orden['Debido'])

        return (
            <FullScreenDialog
                title='Abonos'
                refreshState={() => {
                    setAbonos(null)
                    getOrdenes(setLoading, setOrdenes)
                }}
                content={<ItemsTemplate
                    header={{
                        title: `Abonos de la orden #${abonos.orden['#Num']}`,
                        row1LeftLabel: 'Abonos hechos',
                        row1LeftValue: `${abonos.abonos.length}`,
                        row1RightLabel: 'Total a pagar',
                        row1RightValue: `C$ ${formatearNumeroDinero(abonos.orden['Total'])}`,
                        row2LeftLabel: 'Importe debido',
                        row2LeftValue: Number(debido)===0?<div style={{width: '300px', color: '#FFF', background:'#4CBDA3', borderRadius: '5px'}}>Orden pagada</div>:`C$ ${debido}`,
                        row2RightLabel: 'Fecha limite de pago',
                        row2RightValue: abonos.orden['Fecha limite de pago'] || 'Sin fecha fimite',
                    }}
                    rows={colorCommas(abonos.abonos, ['Monto'])}
                    noNew={Number(debido)===0}
                    newLabel='Nuevo abono'
                    newIcon={<MdAttachMoney />}
                    newInputs={abonosInput}
                    onCreateNew={({ Monto }) => {

                        if (Monto==='') return

                        const payload = { facturaId: abonos.orden.id, abono: Monto }
                        axiosClient.post(`/abono/orden`, payload)
                            .then(({ data }) => {
                                const response = data.message
                                const orden = ordenes.find(o => o.id === abonos.orden.id)
                                orden['Debido'] = (Number(orden['Debido']) - Number(Monto))
                                orden['Pagado'] = (Number(orden['Pagado']) + Number(Monto))
                                showAbonos(abonos.orden.id)
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    }}
                    footer={[{ label: 'Total abonado', value: 'C$ ' + formatearNumeroDinero(abonos.orden['Pagado']) }]}
                />}
            />
        )
    }
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
                        rows={permisoLeerOrdenes ? filterColumns(colorStatesEntrega((id) => { }, colorStates((id) => setCancelar(id), (id) => setActivar(id), colorMoney(colorCommas(ordenes, ['Subtotal', 'Descuento', 'Cargos por mora', 'Total', 'Pagado', 'Debido']), ['Subtotal', 'Descuento', 'Cargos por mora', 'Total', 'Pagado', 'Debido']))), ['Fecha emision', 'Fecha limite de pago', 'Subtotal', 'Descuento', 'Cargos por mora']) : []}
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