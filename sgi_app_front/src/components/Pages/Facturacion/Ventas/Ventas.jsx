import {useState, useEffect} from 'react'
import './Ventas.css'
import Table from '../../../Common/Table/Table'
import RightDrawer from '../../../Common/RightDrawer/RightDrawer'
import { UilInvoice } from '@iconscout/react-unicons'
import CreateInvoice from './CreateInvoice'
import CircularProgress from '../../../Common/CircularProgess/CircularProgress'
import axiosClient from '../../../../axios-client'
import CardView from '../../../Common/CardViews/CardView'
import {ordenarPorAtributo} from '../../../../utils/Ordenamiento'
import { colorStates, colorMoney, colorCommas, colorNullToZero } from '../../../../utils/HandleTable'
import { getVentas } from '../LoadData/LoadData'
import { AiOutlineDollarCircle } from "react-icons/ai";
import { AiTwotonePrinter } from "react-icons/ai";
import { UilEye } from '@iconscout/react-unicons';
import VentaTemplate from './VentaTemplate'
import { useStateContext } from '../../../../Contexts/ContextProvider'

const Ventas = () => {

    const {getPermisos} = useStateContext()
    const permisos = getPermisos()

    const permisoCrearVentas = permisos.find(p=>p.moduloId == 8) && permisos.find(p=>p.moduloId == 8).estado === 't' ? true : false 
    const permisoLeerVentas = permisos.find(p=>p.moduloId == 9) && permisos.find(p=>p.moduloId == 9).estado === 't' ? true : false

    const [loading, setLoading] = useState(false)
    const [openForm, setFormOpen] = useState(false)
    
    // Datos a pedir a la bd
    const [ventas, setVentas] = useState([])
    const [clientes, setClientes] = useState([])
    const [productos, setProductos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [marcas, setMarcas] = useState([])
    const [unidades_medida, setUnidadesMedida] = useState([])
    const [almacenes, setAlmacenes] = useState([])
    const [currentVenta, setCurrentVenta] = useState({id: null, detalles: null})
    const [details, setDetails] = useState(null)
    const [openDetails, setOpenDetails] = useState(false)

    const showDetails = (id) => {
        if (currentVenta.id !== id) {
            axiosClient.get(`/venta/${id}`)
            .then(({ data }) => {
                const orden = ventas.find(o=>o.id===id)
                const detalles = data.orden
                setCurrentVenta({id: id, detalles: detalles})
                const factura = <VentaTemplate orden={orden} detalles={detalles}/>
                setDetails(factura)
                setOpenDetails(true)
            })
            .catch(error => {
                console.log(error)
            })
        } else {
            const orden = ventas.find(o=>o.id===currentVenta.id)
            const detalles = currentVenta.detalles
            const factura = <VentaTemplate orden={orden} detalles={detalles}/>
            setDetails(factura)
            setOpenDetails(true)
        }
    }

    const generateOrdenPDF = (id) => {
        if (currentVenta.id !== id) {
            axiosClient.get(`/venta/${id}`)
            .then(({ data }) => {
                const orden = ventas.find(o=>o.id===id)
                const detalles = data.orden
                setCurrentVenta({id: id, detalles: detalles})
                console.log(orden)
                console.log(detalles)
                /*const factura = renderToString(<VentaTemplate orden={orden} detalles={detalles}/>)
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
                const orden = ventas.find(o=>o.id===currentVenta.id)
                const detalles = currentVenta.detalles
                setCurrentVenta({id: id, detalles: detalles})
                console.log(orden)
                console.log(detalles)
                /*const factura = renderToString(<VentaTemplate orden={orden} detalles={detalles}/>)
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
            condition: () => permisoCrearVentas,
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
            label: 'Imprimir',
            icon: <AiTwotonePrinter />,
            action: (id) => ()=>null//generateOrdenPDF(id)
        },
        {
            label: 'Abonar',
            icon: <AiOutlineDollarCircle />,
            action: (id) => alert('Abonar')
        }
    ]
    

    const getClientes = () => {
        setLoading(true)
        axiosClient.get('/clientes')
            .then(({data}) => {
                const response = data.data
                const formatedClientes = []
                for (let cliente of response) {
                    formatedClientes.push({label: cliente['Nombre']+' '+cliente['Apellido'], value: cliente['id'], info:cliente})
                }
                setClientes(formatedClientes)
                setLoading(false)
            })
            .catch(error=> {
                console.log(error)
                setLoading(false)
            })
    }

    const getProductos = () => {
        setLoading(true)
        axiosClient.get('/productos')
            .then(({data}) => {
                const response = data.data
                const formatedProductos = []
                for (let producto of response) {
                    formatedProductos.push({label: producto['Nombre'], value: producto['id'], info:producto})
                }
                setProductos(formatedProductos)
                setLoading(false)
            })
            .catch(error=> {
                console.log(error)
                setLoading(false)
            })
    }

    const getItems = async () => {
        setLoading(true)
        axiosClient.get('/seleccionables')
          .then(({data}) => {
            setCategorias(data.categorias.map((categoria, index)=> {
              return {
                label: categoria.nombre,
                value: categoria.categoriaId
              }
            }))
            setMarcas(data.marcas.map((marca,index)=> {
              return {
                label: marca.nombre,
                value: marca.marcaId
              }
            }))
            setUnidadesMedida(data.unidades_medida.map((medida, index)=> {
              return {
                label: medida.nombre,
                value: medida.unidadMedidaId
              }
            }))
            const almacenes = ordenarPorAtributo(data.almacenes, 'prioridad')
            setAlmacenes(almacenes.map((almacen)=>{
                return {
                    label: almacen.nombre,
                    value: almacen.almacenId,
                    info: almacen
                }
            }))
            setLoading(false)
          })
          .catch((e) => {
            console.log('Error en la respuesta: '+e);
            setLoading(false)
          }) 
      }

    useEffect(()=>{
        getVentas(setLoading, setVentas)
        getClientes()
        getProductos()
        getItems()
    }, [])

    if(loading) return <CircularProgress />

    return (
        <>
            <div className='ListaVentas'>

                <RightDrawer 
                    width={'100vw'} 
                    content={
                    <CreateInvoice 
                        setOpen={setFormOpen}
                        clientes={clientes}
                        productos={productos}
                        categorias={categorias}
                        marcas={marcas}
                        unidades_medida={unidades_medida}
                        almacenes={almacenes}
                        />
                    }  
                    open={openForm}/>
                <div className='ventas'>
                    <Table 
                        pagination={false} 
                        rows={permisoLeerVentas ? colorStates(colorMoney(colorCommas(colorNullToZero(ventas, ['Total', 'Pagado', 'Debido']), ['Total', 'Pagado', 'Debido']), ['Total', 'Pagado', 'Debido'])) : []}
                        empty={<CardView type='shopping' text={permisoCrearVentas ? 'Aqui veras las ventas que tus clientes realizan!' : 'No tienes permisos para este modulo 😔'}   style={{
                            marginLeft: '35%',
                            width: '30%',
                            height: '100%'
                          }}/>}
                          actions={actions}
                        generalActions={generalActions}
                    />
                </div>

            </div>
        </>
    )
}

export default Ventas