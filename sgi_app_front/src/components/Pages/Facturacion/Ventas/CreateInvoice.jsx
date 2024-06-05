import React, {useState} from 'react'
import './CreateInvoice.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Divider } from '@mui/material';
import { UilStore } from '@iconscout/react-unicons'
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { FiTool } from "react-icons/fi";
import {TextField, TextArea, SelectField, ImgField, DateField} from '../../../Common/AwesomeFields/AwesomeFields'
import TablaNuevaVenta from '../../../Common/Table/Table'
import validateApi from '../../../../utils/textValidation';
import axiosClient from '../../../../axios-client';
import FormDialog from '../../../Common/FormDialog/FormDialog'
import {Button} from '@mui/material';
import { handleFoundCostValidation, handleConditionalCostValidation, handleDoubleCostValidation } from '../../../../utils/Searching'
import { validate } from 'uuid';
import * as dateHelper from '../../../../utils/DatesHelper'
import { Avatar } from '@mui/material';
import hexToDataURL, { isHex } from '../../../../utils/HexToDataUrl';
import logo from '../../../../imgs/logo.png'
import { useStateContext } from '../../../../Contexts/ContextProvider';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ProductosBD from './CarritoClientes/ProductosBD';
import onChangeSize from './InvoiceGeneralActions/FullSize';

// Cambiar esta funcion de ayuda de fichero dateHelper
import { myConcat } from '../../../../utils/Searching';


const formatTable = (table) => {
    const formatedTable = []
    const filteredColumns = ['id', 'Nombre', 'Cantidad', 'Precio de venta', 'Cantidad con descuento', 'Porcentaje de descuento']
     for (let row of table) {
        let copyRow = {}
        
        if (row.Imagen !== '') {
            copyRow.Imagen = <Avatar alt={'producto'} src={isHex(row.Imagen) ? hexToDataURL(row.Imagen) : `data:image/jpeg;base64,${row.Imagen}`}/>
        } else {
            copyRow.Imagen = <Avatar alt={'producto'} src={logo}/>
        }
        
        for (let column of filteredColumns) {
            copyRow[column] = row[column]
        }

        formatedTable.push(copyRow)
    }
    return formatedTable
}

const handleRollbacks = (setRollbacks, label, bool) => {
    setRollbacks(prev=>(
        {
            ...prev,
            [label]: bool
        }
    ))
}

const CreateInvoice = React.memo((props) => {
    const {
        setOpen,
        clientes,
        productos,
        categorias,
        marcas,
        unidades_medida,
        almacenes
    } = props

    const initCliente = {
        id: 'new',
        'Nombre': '',
        'Apellido': '',
        'Mayorista': 'f',
        'Numero RUT': '',
        'Fecha de nacimiento': '',
        'Correo': '',
        'Telefono': '',
        'Direccion': ''
    }

    const initVenta = {
        'Fecha de pago limite': '',
        'Porcentaje de mora': '',
        'Fecha de entrega': '',
        'Establecer limite': 'f',
    }

    const initNewDetalle = {
        id: '',
        Cantidad: '',
        'Inventario': '',
        'Precio de compra': '',
        'Cantidad con descuento': '',
        'Porcentaje de descuento': ''
    }

    const { getUser } = useStateContext()
    const currentUser = getUser().usuarioId
    const [listFullSize, setListFullSize] = useState(false)
    const [cliente, setCliente] = useState(initCliente)
    const [venta, setVenta] = useState(initVenta)
    const [nuevoDetalle, setNuevoDetalle] = useState(initNewDetalle)
    const [listaDetalles, setListaDetalles] = useState([])
    const [edit, setEdit] = useState(null)
    const [requestBd, setRequestBd] = useState(null)
    const [markAsIncomplete, setMarkAsIncomplete] =  useState([])

    const [rollbacks, setRollbacks] = useState({
        'Correo': false,
        'Correo/Formato': false,
        'Cedula': false,
        'Cedula/Formato': false,
        'Telefono': false,
    })

    const generalActions = [onChangeSize(listFullSize, setListFullSize, edit)]

    const onRealizarVenta = () => {
        let rollback = false
        // Validar campos requeridos que vinieron vacios
        let required = ['Fecha de entrega']
        const incompletes = []
        if (cliente.id === 'new') {
            required = myConcat(required, ['Nombre', 'Apellido'])
        }
        // Crear un objeto que contenga los campos del cliente y la venta
        const all = {
            ...cliente,
            ...venta
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
            const payload = {cliente: cliente, venta: venta, detalles: listaDetalles, usuario: currentUser} 
            axiosClient.post('/venta', payload)
                .then(({ data }) => {
                    const response = data.data
                    console.log(response)
                    setOpen(false) // Volver al inicio de Ordenes
                })       
                .catch(error=>{
                    const messageErr = error.response.data.messageError
                    console.log(error)  
                })
          }
    }

    if (requestBd) return requestBd
    else return (
        <div className='container'>
            <div className={`glass ${listFullSize ? 'fullGlass' : 'partialGlass'}`}>
                <div className='exit'>
                    <IconButton  onClick={() => setOpen(false)}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>

                <div className='formCarrito'>
                    <div>            
                        <div className='mainData'>
                            <div className='TitleContainer'>
                            <div className='Title'>
                                <h3>Cliente de la venta</h3>
                                <span style={{
                                background: '#E8E1FF',
                                color: '#5E3AE6',
                                }}><PersonOutlinedIcon /></span>
                            </div>
                            <p>*Ingrese la informacion del cliente</p>
                            </div>
                        </div>
                    </div>

                    <div className='mainData'>
                        <Divider />
                    </div>

                    {/* Datos del cliente*/}
                    <div>
                    <div className='mainData'>
                            <SelectField 
                                value={cliente.id}
                                label='Cliente*'
                                options={[{value: 'new', label: 'Nuevo cliente'}, ...clientes]}
                                onChange={(value) => {
                                    setCliente({
                                        ...cliente,
                                        id: value
                                    })
                                }}
                            />
                    </div>
                    <div style={{display: cliente.id === 'new' ? '' : 'none'}}>
                        <div className='secondaryData'>
                            <TextField 
                                label='Nombre'
                                incomplete={markAsIncomplete.find(l=>l=='Nombre')}
                                placeholder='Obligatorio'
                                value={cliente['Nombre']}
                                onChange={(value, setErr, setWarning)=>{
                                    if (validateApi.name(value)) {
                                        setCliente({
                                            ...cliente,
                                            'Nombre': value
                                        })
                                    }
                                }}
                            />

                            <TextField 
                                label='Apellido'
                                placeholder='Obligatorio'
                                value={cliente['Apellido']}
                                incomplete={markAsIncomplete.find(l=>l=='Apellido')}
                                onChange={(value, setErr, setWarning)=>{
                                    if (validateApi.name(value)) {
                                        setCliente({
                                            ...cliente,
                                            'Apellido': value
                                        })
                                    }
                                }}
                            />
                        </div>

                        <div className='secondaryData'>
                            <TextField 
                                label='Correo'
                                placeholder='Opcional'
                                value={cliente['Correo']}
                                incomplete={markAsIncomplete.find(l=>l=='Correo')}
                                onChange={(value, setErr, setWarning) => {
                                            
                                    handleConditionalCostValidation(value, correo=>validateApi.email(correo), 
                                        ()=>{
                                            setWarning('')
                                            handleRollbacks(setRollbacks, 'Correo/Formato', false)
                                        }, 
                                        ()=>{
                                            setWarning('Formato incorrecto')
                                            handleRollbacks(setRollbacks, 'Correo/Formato', true)
                                    })

                                            

                                    if (!!!!!rollbacks['Correo/Formato']) {
                                        handleFoundCostValidation(
                                            clientes,
                                            'Correo',
                                            value,
                                            ()=>{
                                            setWarning('Correo ya ocupado')
                                            handleRollbacks(setRollbacks, 'Correo', true)
                                            },
                                            () => {
                                            setWarning('')
                                            handleRollbacks(setRollbacks, 'Correo', false)
                                            }
                                        )
                                    }
                                            
                                    setCliente({
                                        ...cliente,
                                        'Correo': value
                                    })
                                }}
                            />

                            <TextField 
                                label='Telefono'
                                placeholder='Opcional'
                                value={cliente['Telefono']}
                                onChange={(value, setErr, setWarning) => {
                                            
                                    handleConditionalCostValidation(value, telefono=>validateApi.phoneLength(telefono), 
                                        ()=>{
                                            setWarning('')
                                            handleRollbacks(setRollbacks, 'Telefono/Formato', false)
                                        }, 
                                        ()=>{
                                            setWarning('Formato incorrecto')
                                            handleRollbacks(setRollbacks, 'Telefono/Formato', true)
                                    })

                                            

                                    if (!!!!!rollbacks['Telefono/Formato']) {
                                        handleFoundCostValidation(
                                            clientes,
                                            'Telefono',
                                            value,
                                            ()=>{
                                            setWarning('Telefono ya ocupado')
                                            handleRollbacks(setRollbacks, 'Telefono', true)
                                            },
                                            () => {
                                            setWarning('')
                                            handleRollbacks(setRollbacks, 'Telefono', false)
                                            }
                                        )
                                    }
                                            
                                    if (validateApi.phone(value) && value.length <= 8) {
                                        setCliente({
                                            ...cliente,
                                            'Telefono': value
                                        })
                                    }
                                }}
                            />
                        </div>
                        
                        <div className='mainData'>
                            <SelectField 
                                label='¿Es un cliente mayorista?'
                                value={cliente['Mayorista']}
                                options={[{label:'No', value:'f'}, {label: 'Si', value: 't'}]}
                                onChange={(value)=>{
                                    setCliente({
                                        ...cliente,
                                        'Mayorista': value
                                    })
                                }}
                            />
                        </div>

                        <div style={{display: cliente['Mayorista'] === 't' ? '' : 'none'}}>
                            <div className='secondaryData'>
                                <DateField 
                                    label='Fecha de nacimiento del colaborador'
                                    placeholder='Obligatorio'
                                    value={cliente['Fecha de nacimiento']}
                                    onChange={(value, setErr, setWarning)=>{
                                    
                                        handleConditionalCostValidation(value, date=>{
                                            if (dateHelper.isGreaterOrEqual(date, dateHelper.getCurrentDate())) return true
                                            return false
                                        }, 
                                        ()=>{
                                            setWarning('Fecha invalida')
                                            handleRollbacks(setRollbacks, 'Fecha de nacimiento', true)
                                        },
                                        ()=>{
                                            setWarning('')
                                            handleRollbacks(setRollbacks, 'Fecha de nacimiento', false)
                                        }
                                        )            

                                        setCliente({
                                            ...cliente,
                                            'Fecha de nacimiento': value
                                        })
                                        
                                    }}
                                />

                                <TextField 
                                    label='Numero RUT'
                                    placeholder='Obligatorio'
                                    value={cliente['Numero RUT']}
                                    onChange={(value)=> {
                                        if (validateApi.numeric(value)) {
                                            setCliente({
                                                ...cliente,
                                                'Numero RUT': value
                                            })
                                        }
                                    }}
                                />
                            </div>

                        </div>

                        <div className='mainData'>
                            <TextArea 
                                label='Direccion'
                                placeholder='Opcional'
                                value={cliente['Direccion']}
                                onChange={(value)=> {
                                    setCliente({
                                        ...cliente,
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
                                <h3>Datos generales de la venta</h3>
                                <span style={{
                                background: '#D8FFF5',
                                color: '#21A97F',
                                }}><LiaFileInvoiceSolid /></span>
                            </div>
                            <p>*Ingrese la informacion necesaria para crear la venta</p>
                            </div>
                        </div>
                    </div>

                    <div className='mainData'>
                        <Divider />
                    </div>

                    {/* Datos de la venta */}
                    <div>
                        
                        <div className='secondaryData'>
                            <DateField 
                                label='Fecha de entrega'
                                incomplete={markAsIncomplete.find(l=>l=='Fecha de entrega')}
                                value={venta['Fecha de entrega']}
                                desactiveManually={!!!rollbacks['Fecha de entrega']}
                                onChange={(value, setErr, setWarning) => {
                                    // Lambda rollback
                                    if (dateHelper.isGreater(value, venta['Fecha de pago limite'])) {
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

                                    if (dateHelper.isLesser(value, dateHelper.getCurrentDate())) {
                                        setErr('Fecha invalida')
                                    } else {
                                        setVenta({
                                            ...venta,
                                            'Fecha de entrega': value
                                        })
                                        setErr('')
                                    }
                                    
                                }}
                            />  
                            <SelectField 
                                label='Establecer fecha limite de pago'
                                value={venta['Establecer limite']}
                                options={[{value: 't', label: 'Si'}, {value: 'f', label: 'No'}]}
                                onChange={(value, setErr, setWarning) => {
                                    setVenta({
                                        ...venta,
                                        'Establecer limite': value
                                    })
                                }}
                            />      
                        </div>

                        <div style={{ display: venta['Establecer limite'] == 't' ? '' : 'none' }} className='secondaryData'>
                            <DateField 
                                label='Fecha limite de pago'
                                value={venta['Fecha de pago limite']}
                                desactiveManually={!!!rollbacks['Fecha limite de pago']}
                                onChange={(value, setErr, setWarning) => {
                                    // Lambda rollback
                                    if (dateHelper.isLesser(value, venta['Fecha de entrega'])) {
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

                                    if (dateHelper.isLesserOrEqual(value, dateHelper.getCurrentDate())) {
                                        setErr('Fecha invalida')
                                    } else {
                                        setVenta({
                                            ...venta,
                                            'Fecha de pago limite': value
                                        })
                                        setErr('')
                                    }
                                    
                                }}
                            />
                            <TextField 
                                label='Porcentaje de mora'
                                value={venta['Porcentaje de mora']}
                                onChange={(value, setErr, setWarning) => {
                                    if (validateApi.positiveReal(value) && validateApi.priceTruncated(value) && Number(value) < 100) {
                                        setVenta({
                                            ...venta,
                                            'Porcentaje de mora': value
                                        })
                                    }
                                }}
                            />
                        </div>
                        
                    </div>

                </div>

                <div className='ticket'>
                    <TablaNuevaVenta 
                        pagination={false}     
                        empty={<h1>Agrega items a la venta</h1>}
                        rows={formatTable(listaDetalles)}
                        generalActions={generalActions}
                    />
                </div>

                <button 
                    onClick={()=>setRequestBd(
                    <ProductosBD 
                        setListaDetalles={setListaDetalles}
                        listaDetalles={listaDetalles}
                        productos={productos}
                        categorias={categorias}
                        marcas={marcas}
                        unidades_medida={unidades_medida}
                        almacenes={almacenes}
                        modelDetalle={initNewDetalle}
                        setClose={()=>setRequestBd(null)}
                    />)}
                    style={{display: edit ? 'none' : ''}}
                    className={`btnAgregarItem ${!listFullSize ? 'partialBtn' : 'noneBtn'}`}
                >
                    Pasar al carrito {<ShoppingCartOutlinedIcon />}
                </button>
                <div style={{display: !edit ? 'none' : ''}} className='editBtns'>
                    <button>Actualizar</button>
                    <button>Cancelar</button>
                </div>
                <button onClick={onRealizarVenta}  className={`btnAgregarOrden ${!listFullSize ? 'partialBtn' : 'fullBtn'}`}>Realizar orden</button>
            </div>
        </div>
    )
})

export default CreateInvoice