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
import { colorStates, colorMoney, colorCommas, colorNullToZero, filterColumns, colorStatesEntrega } from '../../../../utils/HandleTable'
import { getVentas } from '../LoadData/LoadData'
import { AiOutlineDollarCircle } from "react-icons/ai";
import { FaTruck } from "react-icons/fa";
import { UilEye } from '@iconscout/react-unicons';
import VentaTemplate from './VentaTemplate'
import { useStateContext } from '../../../../Contexts/ContextProvider'
import FullScreenDialog from '../../../FullDialog/FullDialog'
import Swal from 'sweetalert2';
import validateApi from '../../../../utils/textValidation'
import { MdAttachMoney } from "react-icons/md";
import ItemsTemplate from '../../../Common/ItemsTemplate/ItemsTemplate'
import {
    formatearNumeroConComas,
    formatearNumeroDinero,
    truncarDecimal,
  } from "../../../../utils/textValidation";
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
    const [abonos, setAbonos] = useState(null)

    const getAbonos = (id) => {
        axiosClient.get(`/abonos/venta/${id}`)
           .then(({ data }) => {
                const abonos = data.abonos
                const venta = ventas.find(v=>v.id === id)
                setAbonos({ venta: venta, abonos: abonos })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const showDetails = (id) => {
        if (currentVenta.id !== id) {
            axiosClient.get(`/venta/${id}`)
            .then(({ data }) => {
                const venta = ventas.find(v=>v.id===id)
                const detalles = data.venta
                setCurrentVenta({id: id, detalles: detalles})
                const factura = <VentaTemplate actions={false} venta={venta} detalles={detalles}/>
                setDetails(factura)
                setOpenDetails(true)
            })
            .catch(error => {
                console.log(error)
            })
        } else {
            const venta = ventas.find(v=>v.id===currentVenta.id)
            const detalles = currentVenta.detalles
            const factura = <VentaTemplate actions={false} venta={venta} detalles={detalles}/>
            setDetails(factura)
            setOpenDetails(true)
        }
    }

    const entrega = (id) => {
        axiosClient.post('/venta/entrega', {id: id})
            .then(({data})=>{
                Swal.fire(
                    'Entregado!',
                    'La venta ha sido entregada.',
                    'success'
                  );
                  getVentas(setLoading, setVentas)
            })
            .catch(error => {
                console.log(error)
            })
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
            label: 'Entrega',
            icon: <FaTruck />,
            action: (id) => {
                const curr = ventas.find(venta=> venta.id === id);
                if (curr['Estado entrega'] === 'Esperando') {
                    Swal.fire({
                      title: '¿Estás seguro?',
                      text: `Estás a punto de entregar esta venta al cliente ${curr['Cliente']}.`,
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Sí, entregar',
                      cancelButtonText: 'Cancelar'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        entrega(id);
                      }
                    });
                  } else {
                    Swal.fire({
                      title: "Venta ya entregada",
                      text: `La venta ya ha sido entregada previamente al cliente ${curr['Cliente']}.`,
                      icon: "info",
                      confirmButtonText: "Ok",
                    });
                  }
            }
        },
        {
            label: 'Abonar',
            icon: <AiOutlineDollarCircle />,
            action: (id) => getAbonos(id)
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
    else if (openDetails) return (<FullScreenDialog
        title='Venta'
        content={details}
        refreshState={() => setOpenDetails(false)}
    />)
    else if (abonos) {

        const abonosInput = [
            {
              label: "Monto",
              type: "text",
              validate: (value) => {
                const overPayment = Number(abonos.venta["Debido"]) < Number(value);
                return (
                  validateApi.positiveReal(value) &&
                  validateApi.priceTruncated(value) &&
                  !!!overPayment
                );
              },
            },
          ];

        const debido = formatearNumeroDinero(abonos.venta["Debido"]);

        return (
          <FullScreenDialog
            title="Abonos"
            refreshState={() => {
              setAbonos(null);
              getVentas(setLoading, setVentas);
            }}
            content={
              <ItemsTemplate
                header={{
                  title: `Abonos de la venta #${abonos.venta["#Num"]}`,
                  row1LeftLabel: "Abonos hechos",
                  row1LeftValue: `${abonos.abonos.length}`,
                  row1RightLabel: "Total a pagar",
                  row1RightValue: `C$ ${formatearNumeroDinero(
                    abonos.venta["Total"]
                  )}`,
                  row2LeftLabel: "Importe debido",
                  row2LeftValue:
                    Number(debido) === 0 ? (
                      <div
                        style={{
                          width: "300px",
                          color: "#FFF",
                          background: "#4CBDA3",
                          borderRadius: "5px",
                        }}
                      >
                        Venta pagada
                      </div>
                    ) : (
                      `C$ ${debido}`
                    ),
                  row2RightLabel: "Fecha limite de pago",
                  row2RightValue:
                    abonos.venta["Fecha limite de pago"] || "Sin fecha fimite",
                }}
                rows={colorCommas(abonos.abonos, ["Monto"])}
                noNew={Number(debido) === 0}
                newLabel="Nuevo abono"
                newIcon={<MdAttachMoney />}
                newInputs={abonosInput}
                onCreateNew={({ Monto }) => {
                  if (Monto === "") return;

                  const payload = { facturaId: abonos.venta.id, abono: Monto };
                  axiosClient
                    .post(`/abono/venta`, payload)
                    .then(({ data }) => {
                      const response = data.message;
                      const venta = ventas.find(
                        (o) => o.id === abonos.venta.id
                      );
                      venta["Debido"] = Number(venta["Debido"]) - Number(Monto);
                      venta["Pagado"] = Number(venta["Pagado"]) + Number(Monto);
                      getAbonos(abonos.venta.id);
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}
                footer={[
                  {
                    label: "Total abonado",
                    value:
                      "C$ " + formatearNumeroDinero(abonos.venta["Pagado"]),
                  },
                ]}
              />
            }
          />
        );
    }
    else return (
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
                         
                        rows={permisoLeerVentas ? filterColumns(colorStatesEntrega(()=>{}, colorStates(()=>{}, ()=>{}, colorMoney( colorCommas(ventas, ['Subtotal', 'Descuento', 'Cargos por mora', 'Total', 'Pagado', 'Debido']), ['Subtotal', 'Descuento', 'Cargos por mora', 'Total', 'Pagado', 'Debido'] ))), ['Fecha emision', 'Fecha limite de pago', 'Subtotal', 'Descuento', 'Cargos por mora', 'Fecha', 'Hora']) : []}
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