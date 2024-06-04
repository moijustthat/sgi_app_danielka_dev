import React, { useState } from 'react'
import './CreateInvoice.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Divider } from '@mui/material';
import { UilStore } from '@iconscout/react-unicons'
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { FiTool } from "react-icons/fi";
import { TbListDetails } from "react-icons/tb";
import { TextField, TextArea, SelectField, ImgField, DateField } from '../../../Common/AwesomeFields/AwesomeFields'
import TablaNuevaOrden from '../../../Common/Table/Table'
import validateApi from '../../../../utils/textValidation';
import axiosClient from '../../../../axios-client';
import '../../../Common/Styles/buttons.css'
import { FaDatabase } from "react-icons/fa";
import FormDialog from '../../../Common/FormDialog/FormDialog'
import ProductosBD from './CarritoProveedores/ProductosBD'
import { Button } from '@mui/material';
import { handleFoundCostValidation, handleConditionalCostValidation, handleDoubleCostValidation } from '../../../../utils/Searching'
import { validate } from 'uuid';
import * as dateHandler from '../../../../utils/DatesHelper'
import { Avatar } from '@mui/material';
import hexToDataURL, { isHex } from '../../../../utils/HexToDataUrl';
import logo from '../../../../imgs/logo.png'
import { useStateContext } from '../../../../Contexts/ContextProvider';
import OrdenTemplate from './OrdenTemplate';
import onChangeSize from './InvoiceGeneralActions/FullSize';
import { UilExpandAlt, UilCompressAlt } from '@iconscout/react-unicons'
import { cleanTable } from '../../../../utils/HandleTable';
import AlertDialog from '../../../Common/AlertDialog/AlertDialog';
import {eliminarElementoPorIndice} from '../../../../utils/DataHelper'
import Abonos from '../Abonos/Abonos';
// Cambiar esta funcion de ayuda de fichero
import { myConcat } from '../../../../utils/Searching';

const formatTable = (table) => {
    const formatedTable = []
    const filteredColumns = ['id', 'Nombre', 'Cantidad', 'Precio de compra', 'Cantidad con descuento', 'Porcentaje de descuento']
    for (let row of table) {
        let copyRow = {}

        if (row.Imagen !== '') {
            copyRow.Imagen = <Avatar alt={'producto'} src={isHex(row.Imagen) ? hexToDataURL(row.Imagen) : `data:image/jpeg;base64,${row.Imagen}`} />
        } else {
            copyRow.Imagen = <Avatar alt={'producto'} src={logo} />
        }

        for (let column of filteredColumns) {
            copyRow[column] = row[column]
        }

        formatedTable.push(copyRow)
    }
    return formatedTable
}

const handleRollbacks = (setRollbacks, label, bool) => {
    setRollbacks(prev => (
        {
            ...prev,
            [label]: bool
        }
    ))
}

const CreateInvoice = React.memo((props) => {
    const {
        setOpen,
        proveedores,
        productos,
        categorias,
        marcas,
        unidades_medida,
        refresh = () => null
    } = props

    const initProveedor = {
        id: 'new',
        'Razon social': '',
        'Numero RUT': '',
        Correo: '',
        Telefono: '',
        Direccion: ''
    }

    const initOrden = {
        'Fecha de pago limite': '',
        'Porcentaje de mora': '',
        'Fecha de entrega': '',
        'Establecer limite de pago': 'f'
    }

    const initNewDetalle = {
        id: 'new',
        Nombre: '',
        'Codigo de barra': '',
        'Precio de venta': '',
        Descripcion: '',
        Categoria: categorias.length > 0 ? categorias[0].value : 'empty',
        Marca: marcas.length > 0 ? marcas[0].value : 'empty',
        'Unidad de medida': unidades_medida.length > 0 ? unidades_medida[0].value : 'empty',
        Metodo: 'peps',
        Minimo: '',
        Maximo: '',
        Caducidad: 'f',
        Imagen: '',
        Cantidad: '',
        'Precio de compra': '',
        'Cantidad con descuento': '',
        'Porcentaje de descuento': ''
    }

    const { getUser } = useStateContext()
    const currentUser = getUser().usuarioId
    const currentUserName = getUser().nombre + ' ' + getUser().apellido
    const [listFullSize, setListFullSize] = useState(false)
    const [proveedor, setProveedor] = useState(initProveedor)
    const [orden, setOrden] = useState(initOrden)
    const [nuevoDetalle, setNuevoDetalle] = useState(initNewDetalle)
    const [listaDetalles, setListaDetalles] = useState([])
    const [edit, setEdit] = useState(null)
    const [del, setDel] = useState(null)
    const [abonar, setAbonar] =  useState(null)
    const [requestBd, setRequestBd] = useState(null)
    const [markAsIncomplete, setMarkAsIncomplete] = useState([])
    const [rollbacks, setRollbacks] = useState({
        'Razon Social': false,
        'Correo': false,
        'Correo/Formato': false,
        'Numero RUT': false,
        'Telefono': false,
        'Fecha limite de pago': false,
        'Fecha de entrega': false,
        'Nombre': false,
        'Codigo de barra': false,
        'Minimo': false,
        'Maximo': false,
        'Fecha de vencimiento': false,
        'Imagen': false
    })
    const [items, setItems] = useState({
        Categoria: '',
        Marca: '',
        'Unidad de medida': ''
    })

    const formatPrefacturaOrden = (orden, proveedor, detalles) => {
        const formatedOrden = {}
        formatedOrden.id  = 'new'
        formatedOrden['Proveedor'] = proveedor.id === 'new' ? proveedor['Razon social'] : proveedores.find(p=>String(p.value)===String(proveedor.id)).label
        formatedOrden['Fecha emision'] = dateHandler.getCurrentDate()
        formatedOrden['Orden hecha por'] = currentUserName
        formatedOrden['Subtotal'] = (detalles.reduce((a, od)=> a + parseFloat(od['Precio de compra'])*Number(od['Cantidad']) ,0)/1.15).toFixed(2)
        formatedOrden['Descuento'] = (detalles.reduce((a, od)=> a + Number(od['Cantidad con descuento'])*parseFloat(od['Precio de compra']) * parseFloat(od['Porcentaje de descuento'])/100, 0)).toFixed(2)
        formatedOrden['Cargos por mora'] = 0
        formatedOrden['Total'] = ((formatedOrden['Subtotal'] * 1.15) - formatedOrden['Descuento']).toFixed(2)
        return formatedOrden
    }

    const formatPrefacturaOrdenDetalles = (detalles) => {
        const formatedDetalles = []
        for (let detalle of detalles) {
            let formatedDetalle = {
                'Producto': detalle['Nombre'],
                'Cantidad': detalle['Cantidad'],
                'Precio': detalle['Precio de compra'],
                'Descuento': detalle['Cantidad con descuento'],
                'Porcentaje': detalle['Porcentaje de descuento']
            }
            formatedDetalles.push(formatedDetalle)
        }
        return formatedDetalles
    }
    
    const generalActions = [
        {
            icon: <FaDatabase />,
            label: 'Ver base de datos',
            condition: () => true,
            action: () => setRequestBd(<ProductosBD
                selectProducto={(id) => {
                    setNuevoDetalle({
                        ...nuevoDetalle,
                        id: id
                    })
                    setRequestBd(null)
                }}
                listaDetalles={listaDetalles}
                productos={productos}
                categorias={categorias}
                marcas={marcas}
                unidades_medida={unidades_medida}
                setListaDetalles={setListaDetalles}
                modelDetalle={initNewDetalle}
                setClose={() => setRequestBd(null)}
            />)
        },
        onChangeSize(listFullSize, setListFullSize, edit)
    ]

    const handleChangeNuevoProducto = (value, setErr, key, validate, personalized = '') => {

        // Validar entrada actual
        // Validar caracter por caracter

        if (key == 'Nombre' || key == 'Descripcion') {
            setNuevoDetalle({
                ...nuevoDetalle,
                [key]: value
            })
            return
        }

        if (!validate(value)) {
            // Mostrar mensaje
            setErr(personalized !== '' ? personalized : `Entrada incorrecta: ${value}`)
            return
        } else {
            setErr('')
        }

        if (key === 'Imagen') {

            if (value === '') {
                setNuevoDetalle({
                    ...nuevoDetalle,
                    [key]: value
                })
                return
            }

            // Validar tipos permitidos en la imagen
            if (value.type !== 'image/avif' && value.type !== 'image/png' && value.type !== 'image/jpeg') return


            const file = value // Esta es la  ruta de la imagen
            const reader = new FileReader()

            reader.onloadend = () => {
                setNuevoDetalle({
                    ...nuevoDetalle,
                    [key]: reader.result.replace("data:", "").replace(/^.+,/, "")
                })
            }

            reader.readAsDataURL(file)

        } else {
            setNuevoDetalle({
                ...nuevoDetalle,
                [key]: value
            })
        }


    }

    const onRealizarOrden = (listaDetalles, proveedor, orden) => {
        let rollback = false
        // Validar campos requeridos que vinieron vacios
        let required = ['Fecha de entrega']
        const incompletes = []
        if (proveedor.id === 'new') {
            required = myConcat(required, ['Razon social', 'Telefono', 'Direccion'])
        }
        // Crear un objeto que contenga los campos del proveedor y la orden
        const all = {
            ...proveedor,
            ...orden
        }
        // Buscar campos requeridos que vienen vacios:
        for (let require of required) {
            if (!!!all[require] || all[require] === '' || all[require] === 'empty') {
                incompletes.push(require)
            }
        }

        if (incompletes.length > 0) {
            setMarkAsIncomplete(incompletes)
            rollback = true
        }

        if (listaDetalles.length < 1) rollback = true

        if (rollback) return null
        else {
            const payload = { proveedor: proveedor, orden: orden, detalles: listaDetalles, usuario: currentUser }
            axiosClient.post('/orden', payload)
                .then(({ data }) => {
                    const orden = data.orden[0]
                    setAbonar(orden)
                    //refresh()
                    //setOpen(false) // Volver al inicio de Ordenes
                })
                .catch(error => {
                    const messageErr = error.response.data.messageError
                    console.log(messageErr)
                })
        }
    }

    const handleAgregarNuevoDetalle = (detalle) => {
        let required = []
        const incompletes = []
        // Si el producto es nuevo
        if (nuevoDetalle.id === 'new') {
            required = myConcat(required, ['Cantidad', 'Precio de compra', 'Nombre', 'Descripcion', 'Categoria', 'Marca', 'Unidad de medida', 'Precio de venta', 'Minimo', 'Maximo', 'Metodo'])
        }

        // Buscar campos requeridos que vienen vacios:
        for (let require of required) {
            if (!!!nuevoDetalle[require] || nuevoDetalle[require] === '' || nuevoDetalle[require] === 'empty') {
                incompletes.push(require)
            }
        }

        if (incompletes.length > 0) {
            setMarkAsIncomplete(incompletes)
            return
        }

        // Revisar si se hara un rollback logico
        for (let rollback of Object.keys(rollbacks)) {
            if (rollbacks[rollback]) return // Si al menos existe un error logico realizar rollback
        }

        // Preparacion para el siguiente nuevo detalle
        setNuevoDetalle(initNewDetalle)
        if(nuevoDetalle['Cantidad con descuento'] === '') nuevoDetalle['Cantidad con descuento'] = 0
        if(nuevoDetalle['Porcentaje de descuento'] === '') nuevoDetalle['Porcentaje de descuento'] = 0

        setListaDetalles(prev => {
            let id = nuevoDetalle.id
            if (id === 'new') id = `new-${nuevoDetalle['Nombre']}`
            nuevoDetalle.id = id
            return [nuevoDetalle, ...prev]
        })
    }

    if (requestBd) return requestBd
    else return <>
        <div className='container'>

            <AlertDialog 
                open={del!==null}
                title='Eliminar item'
                contentText={`Seguro deseas eliminar este item?`}
                cancelText='Cancelar'
                acceptText='Eliminar'
                acceptAction={()=>{
                    setListaDetalles(prev=>{
                        const copyList = [...prev]
                        return eliminarElementoPorIndice(copyList, del)
                    })
                    setDel(null)
                }}
                cancelAction={() => setDel(null)}
            />

            <FormDialog 
                open={abonar!==null}
                setOpen={()=> {setAbonar(null); refresh(); setOpen(false)}}
                title={`Abonar a la orden N°${abonar!==null?abonar.id:''}`}
                content={<Abonos 
                    factura={abonar!==null?abonar:''}
                    tipo='orden'
                    close={()=>{
                        setAbonar(null)
                        refresh()
                        setOpen(false)
                    }}
                />}
            />

            <div className={`glass ${listFullSize ? 'fullGlass' : 'partialGlass'}`}>
                <div className='exit'>
                    <IconButton onClick={() => setOpen(false)}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>

                <div className='formCarrito'>
                    <div>
                        <div className='mainData'>
                            <div className='TitleContainer'>
                                <div className='Title'>
                                    <h3>Proveedor de la orden</h3>
                                    <span style={{
                                        background: '#E8E1FF',
                                        color: '#5E3AE6',
                                    }}><UilStore /></span>
                                </div>
                                <p>*Ingrese la informacion del proveedor al que pedira la orden</p>
                            </div>
                        </div>
                    </div>

                    <div className='mainData'>
                        <Divider />
                    </div>

                    {/* Datos del proveedor*/}
                    <div>
                        <div className='mainData'>
                            <SelectField
                                value={proveedor.id}
                                label='Proveedor*'
                                options={[{ value: 'new', label: 'Nuevo proveedor' }, ...proveedores]}
                                onChange={(value) => {
                                    setProveedor({
                                        ...proveedor,
                                        id: value
                                    })
                                }}
                            />
                        </div>
                        <div style={{ display: proveedor.id === 'new' ? '' : 'none' }}>
                            <div className='secondaryData'>
                                <TextField
                                    value={proveedor['Razon social']}
                                    label='Razon social'
                                    incomplete={markAsIncomplete.find(l => l == 'Razon social')}
                                    onChange={(value, setErr, setWarning) => {
                                        handleFoundCostValidation(
                                            proveedores,
                                            'Razon Social',
                                            value,
                                            () => {
                                                setWarning('Proveedor encontrado en la base de datos')
                                                handleRollbacks(setRollbacks, 'Razon Social', true)
                                            },
                                            () => {
                                                setWarning('')
                                                handleRollbacks(setRollbacks, 'Razon Social', false)
                                            }
                                        )
                                        setProveedor({
                                            ...proveedor,
                                            'Razon social': value
                                        })
                                    }}
                                />

                                <TextField
                                    value={proveedor['Numero RUT']}
                                    label='Numero RUT'
                                    placeholder='*************'
                                    onChange={(value, setErr, setWarning) => {
                                        handleFoundCostValidation(
                                            proveedores,
                                            'Numero RUT',
                                            value,
                                            () => {
                                                setWarning('RUT encontrado en la base de datos')
                                                handleRollbacks(setRollbacks, 'Numero RUT', true)
                                            },
                                            () => {
                                                setWarning('')
                                                handleRollbacks(setRollbacks, 'Numero RUT', false)
                                            }
                                        )
                                        if (validateApi.numeric(value)) {
                                            setProveedor({
                                                ...proveedor,
                                                'Numero RUT': value
                                            })
                                        }
                                    }}
                                />
                            </div>

                            <div className='secondaryData'>
                                <TextField
                                    value={proveedor['Correo']}
                                    label='Correo'
                                    onChange={(value, setErr, setWarning) => {

                                        handleConditionalCostValidation(value, correo => validateApi.email(correo), () => {
                                            setWarning('')
                                            handleRollbacks(setRollbacks, 'Correo/Formato', false)
                                        }, () => {
                                            setWarning('Formato incorrecto')
                                            handleRollbacks(setRollbacks, 'Correo/Formato', true)
                                        })



                                        if (!!!!!rollbacks['Correo/Formato']) {
                                            handleFoundCostValidation(
                                                proveedores,
                                                'Correo',
                                                value,
                                                () => {
                                                    setWarning('Correo encontrado en la base de datos')
                                                    handleRollbacks(setRollbacks, 'Correo', true)
                                                },
                                                () => {
                                                    setWarning('')
                                                    handleRollbacks(setRollbacks, 'Correo', false)
                                                }
                                            )
                                        }


                                        setProveedor({
                                            ...proveedor,
                                            'Correo': value
                                        })
                                    }}
                                />
                                <TextField
                                    value={proveedor['Telefono']}
                                    label='Telefono'
                                    incomplete={markAsIncomplete.find(l => l == 'Telefono')}
                                    onChange={(value, setErr, setWarning) => {
                                        handleFoundCostValidation(
                                            proveedores,
                                            'Telefono',
                                            value,
                                            () => {
                                                setWarning('Telefono encontrado en la base de datos')
                                                handleRollbacks(setRollbacks, 'Telefono', true)
                                            },
                                            () => {
                                                setWarning('')
                                                handleRollbacks(setRollbacks, 'Telefono', false)
                                            }
                                        )
                                        if (validateApi.numeric(value) && value.length <= 8) {
                                            setProveedor({
                                                ...proveedor,
                                                'Telefono': value
                                            })
                                        }
                                    }}
                                />
                            </div>

                            <div className='mainData'>
                                <TextArea
                                    value={proveedor['Direccion']}
                                    incomplete={markAsIncomplete.find(l => l == 'Direccion')}
                                    label='Direccion'
                                    onChange={(value, setErr) => {
                                        setProveedor({
                                            ...proveedor,
                                            'Direccion': value
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    </div>


                    <div>
                        <div className='mainData'>
                            <div className='TitleContainer'>
                                <div className='Title'>
                                    <h3>Datos generales de la orden</h3>
                                    <span style={{
                                        background: '#D8FFF5',
                                        color: '#21A97F',
                                    }}><LiaFileInvoiceSolid /></span>
                                </div>
                                <p>*Ingrese la informacion necesaria para crear la orden</p>
                            </div>
                        </div>
                    </div>

                    <div className='mainData'>
                        <Divider />
                    </div>

                    {/* Datos de la orden */}
                    <div>
                        <div className='secondaryData'>
                            <DateField
                                label='Fecha de entrega'
                                incomplete={markAsIncomplete.find(l => l == 'Fecha de entrega')}
                                value={orden['Fecha de entrega']}
                                desactiveManually={!!!rollbacks['Fecha de entrega']}
                                onChange={(value, setErr, setWarning) => {
                                    // Lambda rollback
                                    if (dateHandler.isGreater(value, orden['Fecha de pago limite'])) {
                                        setWarning('La fecha de entrega no puede ser despues de haber cobrado mora')
                                        setRollbacks({
                                            ...rollbacks,
                                            'Fecha limite de pago': true,
                                            'Fecha de entrega': true
                                        })
                                    } else {
                                        setWarning('')
                                        setRollbacks({
                                            ...rollbacks,
                                            'Fecha limite de pago': false,
                                            'Fecha de entrega': false
                                        })
                                    }

                                    if (dateHandler.isLesser(value, dateHandler.getCurrentDate())) {
                                        setErr('Fecha invalida')
                                    } else {
                                        setOrden({
                                            ...orden,
                                            'Fecha de entrega': value
                                        })
                                        setErr('')
                                    }

                                }}
                            />
                            <SelectField
                                label='Establecer fecha limite de pago'
                                value={orden['Establecer limite de pago']}
                                options={[{ value: 't', label: 'Establecer fecha limite' }, { value: 'f', label: 'No establecer fecha limite' }]}
                                onChange={(value, setErr, setWarning) => {
                                    setOrden({
                                        ...orden,
                                        'Establecer limite de pago': value
                                    })
                                }}
                            />
                        </div>
                        <div style={{ display: orden['Establecer limite de pago'] == 't' ? '' : 'none' }} className='secondaryData'>
                            <DateField
                                label='Fecha limite de pago'
                                value={orden['Fecha de pago limite']}
                                desactiveManually={!!!rollbacks['Fecha limite de pago']}
                                onChange={(value, setErr, setWarning) => {
                                    // Lambda rollback
                                    if (dateHandler.isLesser(value, orden['Fecha de entrega'])) {
                                        setWarning('La fecha limite no puede ser anterior a la de entrega')
                                        setRollbacks({
                                            ...rollbacks,
                                            'Fecha limite de pago': true,
                                            'Fecha de entrega': true
                                        })
                                    } else {
                                        setWarning('')
                                        setRollbacks({
                                            ...rollbacks,
                                            'Fecha limite de pago': false,
                                            'Fecha de entrega': false
                                        })
                                    }

                                    if (dateHandler.isLesser(value, dateHandler.getCurrentDate())) {
                                        setErr('Fecha invalida')
                                    } else {
                                        setOrden({
                                            ...orden,
                                            'Fecha de pago limite': value
                                        })
                                        setErr('')
                                    }

                                }}
                            />
                            <TextField
                                label='Porcentaje de mora'
                                value={orden['Porcentaje de mora']}
                                onChange={(value, setErr, setWarning) => {
                                    if (validateApi.decimalPositiveOrZero(value)
                                        && validateApi.priceTruncated(value)
                                        && Number(value) < 100) {
                                        setOrden({
                                            ...orden,
                                            'Porcentaje de mora': value
                                        })
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='mainData'>
                            <div className='TitleContainer'>
                                <div className='Title'>
                                    <h3>Item</h3>
                                    <span style={{
                                        background: '#E0F3FE',
                                        color: '#73CBFE',
                                    }}><TbListDetails /></span>
                                </div>
                                <p>*Nuevo item</p>
                            </div>
                        </div>
                    </div>

                    <div className='mainData'>
                        <Divider />
                    </div>

                    {/* Datos del item */}

                    {/* Datos del produco*/}
                    <div className='mainData'>
                        <SelectField
                            value={nuevoDetalle.id}
                            label='Producto'
                            options={[{ value: 'new', label: 'Nuevo producto' }, { value: 'bd', label: 'Buscar en la base de datos' }]}
                            onChange={(value, setErr) => {
                                if (value === 'bd') {
                                    setRequestBd(<ProductosBD
                                        selectProducto={(id) => {
                                            setNuevoDetalle({
                                                ...nuevoDetalle,
                                                id: id
                                            })
                                            setRequestBd(null)
                                        }}
                                        listaDetalles={listaDetalles}
                                        productos={productos}
                                        categorias={categorias}
                                        marcas={marcas}
                                        unidades_medida={unidades_medida}
                                        setListaDetalles={setListaDetalles}
                                        modelDetalle={initNewDetalle}
                                        setClose={() => setRequestBd(null)}
                                    />)
                                }
                                else {
                                    setRequestBd(null)
                                    setNuevoDetalle({
                                        ...nuevoDetalle,
                                        id: value
                                    })
                                }
                            }}
                        />
                    </div>
                    <div style={{ display: nuevoDetalle.id === 'new' ? '' : 'none' }}>
                        <div className='secondaryData'>
                            <TextField
                                label='Nombre'
                                value={nuevoDetalle['Nombre']}
                                incomplete={markAsIncomplete.find(l => l == 'Nombre')}
                                onChange={(value, setErr, setWarning) => {
                                    const matrix = myConcat(productos, listaDetalles)
                                    if (!edit) handleFoundCostValidation(matrix, 'Nombre', value, () => {
                                        setWarning('Producto encontrado en el catalogo de productos')
                                        setRollbacks({
                                            ...rollbacks,
                                            'Nombre': true
                                        })
                                    },
                                        () => {
                                            setWarning('')
                                            setRollbacks({
                                                ...rollbacks,
                                                'Nombre': false
                                            })
                                        }
                                    )
                                    handleChangeNuevoProducto(value, setErr, 'Nombre', validateApi.everything)
                                }}
                            />

                            <TextField
                                label='Codigo de barra'
                                value={nuevoDetalle['Codigo de barra']}
                                onChange={(value, setErr, setWarning) => {
                                    const matrix = myConcat(productos, listaDetalles)
                                    if (!edit) handleFoundCostValidation(matrix, 'Codigo de barra', value, () => {
                                        setWarning('Codigo de barra ya existente')
                                        setRollbacks({
                                            ...rollbacks,
                                            'Codigo de barra': true
                                        })
                                    },
                                        () => {
                                            setWarning('')
                                            setRollbacks({
                                                ...rollbacks,
                                                'Codigo de barra': false
                                            })
                                        }
                                    )
                                    handleChangeNuevoProducto(value, setWarning, 'Codigo de barra', validateApi.numeric)
                                }}
                            />

                            <TextField
                                label='Precio de venta'
                                value={nuevoDetalle['Precio de venta']}
                                incomplete={markAsIncomplete.find(l => l == 'Precio de venta')}
                                onChange={(value, setErr, setWarning) => {
                                    if (validateApi.positiveReal(value) && validateApi.priceTruncated(value)) {
                                        setNuevoDetalle(prev => ({
                                            ...prev,
                                            'Precio de venta': value
                                        }))
                                    }
                                }}
                            />
                        </div>
                        <div className='mainData'>
                            <TextArea
                                label='Descripcion'
                                incomplete={markAsIncomplete.find(l => l == 'Descripcion')}
                                value={nuevoDetalle['Descripcion']}
                                onChange={(value, setErr, setWarning) => {
                                    setNuevoDetalle({
                                        ...nuevoDetalle,
                                        ['Descripcion']: value
                                    })
                                }}
                            />
                        </div>
                        <div className='secondaryData'>
                            <div style={{ display: nuevoDetalle['Categoria'] === 'new' ? 'none' : '' }}>
                                <SelectField
                                    label='Categoria'
                                    incomplete={markAsIncomplete.find(l => l == 'Categoria')}
                                    value={nuevoDetalle['Categoria']}
                                    options={myConcat([{ label: 'Nueva categoria', value: 'new' }], categorias)}
                                    onChange={(value, setErr, setWarning) => {
                                        setNuevoDetalle({
                                            ...nuevoDetalle,
                                            ['Categoria']: value
                                        })
                                    }}
                                />
                            </div>
                            <div style={{ display: nuevoDetalle['Categoria'] === 'new' ? '' : 'none' }} className='campoNuevaCategoria nuevoItem'>
                                <div className='secondaryData'>
                                    <TextField
                                        value={items.Categoria}
                                        incomplete={markAsIncomplete.find(l => l == 'Categoria')}
                                        onChange={(value, setErr) => {
                                            if (validateApi.name(value)) {
                                                setItems({
                                                    ...items,
                                                    Categoria: value
                                                })
                                            }
                                        }}
                                        label='Nueva Categoria'
                                        placeholder='Requerido'
                                    />
                                    <div className='btnGroup'>
                                        <button onClick={() => {
                                            const payload = { categoria: items.Categoria }
                                            axiosClient.post('/categoria', payload)
                                                .then(({ data }) => {
                                                    const Categoria = data.data
                                                    const value = Categoria.value.val
                                                    const label = Categoria.label.label
                                                    setNuevoDetalle({
                                                        ...nuevoDetalle,
                                                        Categoria: value
                                                    })
                                                    setItems({
                                                        ...items,
                                                        Categoria: ''
                                                    })
                                                    categorias.unshift({ value, label })
                                                })
                                                .catch(error => {
                                                    const messageError = error.response.data
                                                    console.log(messageError);
                                                })
                                        }}>
                                            Crear
                                        </button>
                                        <button onClick={() => {
                                            setNuevoDetalle({
                                                ...nuevoDetalle,
                                                ['Categoria']: 'empty'
                                            })
                                            setItems({
                                                ...items,
                                                Categoria: ''
                                            })
                                        }}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: nuevoDetalle['Marca'] === 'new' ? 'none' : '' }}>
                                <SelectField
                                    label='Marca'
                                    value={nuevoDetalle['Marca']}
                                    incomplete={markAsIncomplete.find(l => l == 'Marca')}
                                    options={myConcat([{ label: 'Nueva marca', value: 'new' }], marcas)}
                                    onChange={(value, setErr, setWarning) => {
                                        setNuevoDetalle({
                                            ...nuevoDetalle,
                                            ['Marca']: value
                                        })
                                    }}
                                />
                            </div>
                            <div style={{ display: nuevoDetalle['Marca'] === 'new' ? '' : 'none' }} className='campoNuevaMarca nuevoItem'>
                                <div className='secondaryData'>
                                    <TextField
                                        value={items.Marca}
                                        incomplete={markAsIncomplete.find(l => l == 'Marca')}
                                        onChange={(value, setErr) => {
                                            if (validateApi.name(value)) {
                                                setItems({
                                                    ...items,
                                                    Marca: value
                                                })
                                            }
                                        }}
                                        label='Nueva Marca'
                                        placeholder='Requerido'
                                    />
                                    <div className='btnGroup'>
                                        <button onClick={() => {
                                            const payload = { marca: items.Marca }
                                            axiosClient.post('/marca', payload)
                                                .then(({ data }) => {
                                                    const Marca = data.data
                                                    const value = Marca.value.val
                                                    const label = Marca.label.label
                                                    setNuevoDetalle({
                                                        ...nuevoDetalle,
                                                        Marca: value
                                                    })
                                                    setItems({
                                                        ...items,
                                                        Marca: ''
                                                    })
                                                    marcas.unshift({ value, label })
                                                })
                                                .catch(error => {
                                                    const messageError = error.response.data
                                                    console.log(messageError);
                                                })
                                        }}>
                                            Crear
                                        </button>
                                        <button onClick={() => {
                                            setNuevoDetalle({
                                                ...nuevoDetalle,
                                                ['Marca']: 'empty'
                                            })
                                            setItems({
                                                ...items,
                                                Marca: ''
                                            })
                                        }}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='secondaryData'>
                            <div style={{ display: nuevoDetalle['Unidad de medida'] === 'new' ? 'none' : '' }}>
                                <SelectField
                                    label='Unidad de medida'
                                    value={nuevoDetalle['Unidad de medida']}
                                    incomplete={markAsIncomplete.find(l => l == 'Unidad de medida')}
                                    options={myConcat([{ label: 'Nueva medida', value: 'new' }], unidades_medida)}
                                    onChange={(value, setErr, setWarning) => {
                                        setNuevoDetalle({
                                            ...nuevoDetalle,
                                            ['Unidad de medida']: value
                                        })
                                    }}
                                />
                            </div>
                            <div style={{ display: nuevoDetalle['Unidad de medida'] === 'new' ? '' : 'none' }} className='campoNuevaMarca nuevoItem'>
                                <div className='secondaryData'>
                                    <TextField
                                        value={items['Unidad de medida']}
                                        incomplete={markAsIncomplete.find(l => l == 'Unidad de medida')}
                                        onChange={(value, setErr) => {
                                            if (validateApi.name(value)) {
                                                setItems({
                                                    ...items,
                                                    'Unidad de medida': value
                                                })
                                            }
                                        }}
                                        label='Nueva unidad de medida'
                                        placeholder='Requerido'
                                    />
                                    <div className='btnGroup'>
                                        <button onClick={() => {
                                            const payload = { medida: items['Unidad de medida'] }
                                            axiosClient.post('/unidad_medida', payload)
                                                .then(({ data }) => {
                                                    const medida = data.data
                                                    const value = medida.value.val
                                                    const label = medida.label.label
                                                    setNuevoDetalle({
                                                        ...nuevoDetalle,
                                                        'Unidad de medida': value
                                                    })
                                                    setItems({
                                                        ...items,
                                                        'Unidad de medida': ''
                                                    })
                                                    unidades_medida.unshift({ value, label })
                                                })
                                                .catch(error => {
                                                    const messageError = error.response.data
                                                    console.log(messageError);
                                                })
                                        }}>
                                            Crear
                                        </button>
                                        <button onClick={() => {
                                            setNuevoDetalle({
                                                ...nuevoDetalle,
                                                'Unidad de medida': 'empty'
                                            })
                                            setItems({
                                                ...items,
                                                'Unidad de medida': ''
                                            })
                                        }}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <SelectField
                                label='Metodo de inventario'
                                value={nuevoDetalle['Metodo']}
                                incomplete={markAsIncomplete.find(l => l == 'Metodo')}
                                options={[{ label: 'peps', value: 'peps' }, { label: 'ueps', value: 'ueps' }]}
                                onChange={(value, setErr, setWarning) => {
                                    setNuevoDetalle({
                                        ...nuevoDetalle,
                                        ['Metodo']: value
                                    })
                                }}
                            />
                        </div>
                        <div className='secondaryData'>
                            <TextField
                                label='Minimo'
                                value={nuevoDetalle['Minimo']}
                                desactiveManually={!!!rollbacks['Minimo']}
                                incomplete={markAsIncomplete.find(l => l == 'Minimo')}
                                onChange={(value, setErr, setWarning) => {
                                    if (nuevoDetalle.Maximo !== '') {
                                        const Minimo = Number(value)
                                        const Maximo = Number(nuevoDetalle.Maximo)
                                        handleDoubleCostValidation({ label: 'Minimo', value: Minimo }, { label: 'Maximo', value: Maximo }, (val1, val2) => {
                                            if (val1 > val2) {
                                                setWarning('Minimo no puede ser mayor al maximo')
                                                return true
                                            }
                                            else if (val1 === val2) {
                                                setWarning('Debes dejar un margen entre el maximo y minimo')
                                                return true
                                            }
                                            else {
                                                setWarning('')
                                                return false
                                            }
                                        }, setRollbacks)
                                    }
                                    if (validateApi.number(value)) {
                                        setNuevoDetalle({
                                            ...nuevoDetalle,
                                            ['Minimo']: value
                                        })
                                    }
                                }}
                            />
                            <TextField
                                label='Maximo'
                                value={nuevoDetalle['Maximo']}
                                desactiveManually={!!!rollbacks['Maximo']}
                                incomplete={markAsIncomplete.find(l => l == 'Maximo')}
                                onChange={(value, setErr, setWarning) => {
                                    if (nuevoDetalle.Minimo !== '') {
                                        const Maximo = Number(value)
                                        const Minimo = Number(nuevoDetalle.Minimo)
                                        handleDoubleCostValidation({ label: 'Maximo', value: Maximo }, { label: 'Minimo', value: Minimo }, (val1, val2) => {
                                            if (val1 < val2) {
                                                setWarning('Maximo no puede ser menor al minimo')
                                                return true
                                            }
                                            else if (val1 === val2) {
                                                setWarning('Debes dejar un margen entre el maximo y minimo')
                                                return true
                                            }
                                            else {
                                                setWarning('')
                                                return false
                                            }
                                        }, setRollbacks)
                                    }
                                    if (validateApi.number(value)) {
                                        setNuevoDetalle({
                                            ...nuevoDetalle,
                                            ['Maximo']: value
                                        })
                                    }
                                }}
                            />
                        </div>
                        <div className='secondaryData'>
                            <SelectField
                                label='Es un producto con fecha de caducidad?'
                                value={nuevoDetalle['Caducidad']}
                                options={[{ label: 'no', value: 'f' }, { label: 'si', value: 't' }]}
                                onChange={(value, setErr, setWarning) => {
                                    setNuevoDetalle({
                                        ...nuevoDetalle,
                                        'Caducidad': value
                                    })
                                }}
                            />
                            <ImgField
                                label='Imagen del producto'
                                value={nuevoDetalle['Imagen']}
                                onChange={(value, setErr, setWarning) => {
                                    handleConditionalCostValidation(value, (img) => img.type !== 'image/avif'
                                        && img.type !== 'image/png'
                                        && img.type !== 'image/jpeg',
                                        () => {
                                            setWarning('Formato de archivo incorrecto')
                                            setRollbacks({
                                                ...rollbacks,
                                                'Imagen': true
                                            })
                                        },
                                        () => {
                                            setWarning('')
                                            setRollbacks({
                                                ...rollbacks,
                                                'Imagen': false
                                            })
                                        }
                                    )
                                    handleChangeNuevoProducto(value, setErr, 'Imagen', validateApi.everything)
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ display: nuevoDetalle.id === 'new' ? '' : 'none' }} className='secondaryData'>
                        <TextField
                            label='Cantidad'
                            incomplete={markAsIncomplete.find(l => l == 'Cantidad')}
                            desactiveManually={!!!rollbacks['Cantidad']}
                            value={nuevoDetalle.Cantidad}
                            onChange={(value, setErr, setWarning) => {
                                const cantidad = Number(value)
                                handleDoubleCostValidation({ label: 'Cantidad', value: cantidad }, { label: 'Cantidad con descuento', value: Number(nuevoDetalle['Cantidad con descuento']) }, (val1, val2) => {
                                    if (val1 < val2) {
                                        setWarning('Cantidad inferior a la del descuento')
                                        return true
                                    } else {
                                        setWarning('')
                                        return false
                                    }
                                }, setRollbacks)
                                if (validateApi.number(value)) setNuevoDetalle({
                                    ...nuevoDetalle,
                                    'Cantidad': value
                                })
                            }}
                        />
                        <TextField
                            label='Precio de compra'
                            value={nuevoDetalle['Precio de compra']}
                            incomplete={markAsIncomplete.find(l => l == 'Precio de compra')}
                            onChange={(value, setErr, setWarning) => {
                                if (validateApi.positiveReal(value) && validateApi.priceTruncated(value)) {
                                    setNuevoDetalle({
                                        ...nuevoDetalle,
                                        ['Precio de compra']: value
                                    })
                                }
                            }}
                        />
                    </div>
                    <div style={{ display: nuevoDetalle.id === 'new' ? '' : 'none' }} className='secondaryData'>
                        <TextField
                            label='Aplicar descuento a'
                            value={nuevoDetalle['Cantidad con descuento']}
                            desactiveManually={!rollbacks['Cantidad con descuento']}
                            onChange={(value, setErr, setWarning) => {
                                const cantidad = Number(value)
                                handleDoubleCostValidation({ label: 'Cantidad con descuento', value: cantidad }, { label: 'Cantidad', value: Number(nuevoDetalle['Cantidad']) }, (val1, val2) => {
                                    if (val1 > val2) {
                                        setWarning('Esta cantidad sobrepasa a la de tu orden')
                                        return true
                                    } else {
                                        setWarning('')
                                        return false
                                    }
                                }, setRollbacks)
                                if (validateApi.positiveIntegerOrZero(value)) setNuevoDetalle({
                                    ...nuevoDetalle,
                                    'Cantidad con descuento': value
                                })
                            }}
                        />
                        <TextField
                            label='Porcentaje de descuento'
                            value={nuevoDetalle['Porcentaje de descuento']}
                            onChange={(value, setErr, setWarning) => {
                                if (validateApi.decimalPositiveOrZero(value) &&
                                    validateApi.priceTruncated(value) &&
                                    Number(value) < 100
                                ) {
                                    setNuevoDetalle({
                                        ...nuevoDetalle,
                                        ['Porcentaje de descuento']: value
                                    })
                                }
                            }}
                        />
                    </div>
                </div>

                <div className='ticket'>
                    <TablaNuevaOrden
                        pagination={false}
                        empty={<h1>Agrega items a la orden</h1>}
                        rows={formatTable(listaDetalles)}
                        generalActions={generalActions}
                        footer={!!!listFullSize ? <div style={{display: 'flex', alignItems: 'center', marginLeft: '8rem', marginTop: '4.5rem'}}>
                            <h4>Despliega para ver la prefactura</h4>
                            <label><UilExpandAlt /></label>
                        </div> : <OrdenTemplate
                            imprimir={false}
                            title='Pre-Factura'
                            orden={formatPrefacturaOrden(orden, proveedor, listaDetalles)}
                            detalles={formatPrefacturaOrdenDetalles(listaDetalles)}
                            deleteItem={(index)=>setDel(index)}
                            updateItem={(index)=>setEdit(index)}
                            setItem={setListaDetalles}
                            edit={edit}
                        />}
                    />
                </div>

                <button style={{ display: edit ? 'none' : '' }}
                    className={`btnAgregarItem ${!listFullSize ? 'partialBtn' : 'noneBtn'}`}
                    onClick={() => handleAgregarNuevoDetalle(nuevoDetalle)}
                >Agregar a la factura</button>
                <div style={{ display: !edit ? 'none' : '' }} className='editBtns'>
                    <button>Actualizar</button>
                    <button>Cancelar</button>
                </div>
                <button onClick={() => onRealizarOrden(listaDetalles, proveedor, orden)} className={`btnAgregarOrden ${!listFullSize ? 'partialBtn' : 'fullBtn'}`}>Realizar orden</button>
            </div>
        </div>
    </>
})

export default CreateInvoice