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
import * as dateHandler from '../../../../utils/DatesHelper'
import { Avatar } from '@mui/material';
import hexToDataURL, { isHex } from '../../../../utils/HexToDataUrl';
import logo from '../../../../imgs/logo.png'
import { useStateContext } from '../../../../Contexts/ContextProvider';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

import onChangeSize from './InvoiceGeneralActions/FullSize';

// Cambiar esta funcion de ayuda de fichero
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
        unidades_medida
    } = props

    const initCliente = {
        id: 'new',
        'Nombre': '', //Obligatorio
        'Apellido': '', //Obligatorio
        'Cedula': '', 
        Telefono: '',
        Correo: '',
        Direccion: ''
    }

    const initVenta = {
        'Fecha de pago limite': '',
        'Porcentaje de mora': '',
        'Fecha de entrega': '',
        Estado: 'pendiente',
    }

    const initNewDetalle = {
        id: '',
        Cantidad: '',
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

    const onRealizarVenta = (listaDetalles, cliente, venta) => {
        let rollback = false
        // Validar campos requeridos que vinieron vacios
        let required = ['Fecha de entrega', 'Estado']
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
                })       
                .catch(error=>{
                    const messageErr = error.response.data.messageError
                    console.log(messageErr)
                })
          }
    }

    return (
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
                                    value={cliente['Nombre']}
                                    incomplete={markAsIncomplete.find(l=>l=='Nombre')}
                                    label='Nombre'
                                    onChange={(value, setErr, setWarning) => {
                                        if (validateApi.name(value)) {
                                            setCliente({
                                                ...cliente,
                                                'Nombre': value
                                            })
                                            setWarning('')
                                        } else {
                                            setWarning('Entrada incorrecta: '+value)
                                        }
                                        
                                    }}
                                />
                                    <TextField 
                                    value={cliente['Apellido']}
                                    incomplete={markAsIncomplete.find(l=>l=='Apellido')}
                                    label='Apellido'
                                    onChange={(value, setErr, setWarning) => {
                                        if (validateApi.name(value)) {
                                            setCliente({
                                                ...cliente,
                                                'Apellido': value
                                            })
                                            setWarning('')
                                        } else {
                                            setWarning('Entrada incorrecta: '+value)
                                        }
                                        
                                    }}
                                />
                            </div>

                            <div className='secondaryData'>
                                <TextField 
                                    value={cliente['Correo']}
                                    label='Correo'
                                    onChange={(value, setErr, setWarning) => {
                                        
                                        handleConditionalCostValidation(value, correo=>validateApi.email(correo), ()=>{
                                            setWarning('')
                                            handleRollbacks(setRollbacks, 'Correo/Formato', false)
                                        }, ()=>{
                                            setWarning('Formato incorrecto')
                                            handleRollbacks(setRollbacks, 'Correo/Formato', true)
                                        })

                                    

                                        if (!!!!!rollbacks['Correo/Formato']) {
                                            handleFoundCostValidation(
                                                clientes,
                                                'Correo',
                                                value,
                                                ()=>{
                                                    setWarning('Correo encontrado en la base de datos')
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
                                    value={cliente['Telefono']}
                                    label='Telefono'
                                    incomplete={markAsIncomplete.find(l=>l=='Telefono')}
                                    onChange={(value, setErr, setWarning) => {
                                        handleFoundCostValidation(
                                            clientes,
                                            'Telefono',
                                            value,
                                            ()=>{
                                                setWarning('Telefono encontrado en la base de datos')
                                                handleRollbacks(setRollbacks, 'Telefono', true)
                                            },
                                            () => {
                                                setWarning('')
                                                handleRollbacks(setRollbacks, 'Telefono', false)
                                            }
                                        )
                                        if (validateApi.numeric(value) && value.length <= 8) {
                                            setCliente({
                                                ...cliente,
                                                'Telefono': value
                                            })
                                        }
                                    }}
                                />
                            </div>

                            <div className='secondaryData'>
                                <TextField 
                                    value={cliente['Cedula']}
                                    label='Cedula'
                                    placeholder='xxx-xxxxxx-xxxxY'
                                    onChange={(value, setErr, setWarning) => {
                                        
                                        handleConditionalCostValidation(value, cedula=>validateApi.cedula(cedula), ()=>{
                                            handleRollbacks(setRollbacks, 'Cedula/Formato', false)
                                            setWarning('')
                                        }, ()=>{
                                            setWarning('Formato incorrecto')
                                            handleRollbacks(setRollbacks, 'Cedula/Formato', true)
                                        })

                                    

                                        if (!!!!!rollbacks['Cedula/Formato']) {
                                            handleFoundCostValidation(
                                                clientes,
                                                'Cedula',
                                                value,
                                                ()=>{
                                                    setWarning('Cedula encontrada en la base de datos')
                                                    handleRollbacks(setRollbacks, 'Cedula', true)
                                                },
                                                () => {
                                                    if (!!!rollbacks['Cedula/Formato']) setWarning('') // Arreglar el parpadeo del warning
                                                    handleRollbacks(setRollbacks, 'Cedula', false)
                                                }
                                            )
                                        }
                                    
                                        setCliente({
                                            ...cliente,
                                            'Cedula': value
                                        })
                                    }}
                                />
                                <TextArea 
                                value={cliente['Direccion']}
                                incomplete={markAsIncomplete.find(l=>l=='Direccion')}
                                label='Direccion'
                                onChange={(value, setErr) => {
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
                                label='Fecha limite de pago(no requerida)'
                                value={venta['Fecha de pago limite']}
                                desactiveManually={!!!rollbacks['Fecha limite de pago']}
                                onChange={(value, setErr, setWarning) => {
                                    // Lambda rollback
                                    if (dateHandler.isLesser(value, venta['Fecha de entrega'])) {
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

                                    if (dateHandler.isLesserOrEqual(value, dateHandler.getCurrentDate())) {
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
                        <div className='secondaryData'>
                            <DateField 
                                label='Fecha de entrega'
                                incomplete={markAsIncomplete.find(l=>l=='Fecha de entrega')}
                                value={venta['Fecha de entrega']}
                                desactiveManually={!!!rollbacks['Fecha de entrega']}
                                onChange={(value, setErr, setWarning) => {
                                    // Lambda rollback
                                    if (dateHandler.isGreater(value, venta['Fecha de pago limite'])) {
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

                                    if (dateHandler.isLesserOrEqual(value, dateHandler.getCurrentDate())) {
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
                                label='Estado'
                                value={venta['Estado']}
                                options={[{value: 'pendiente', label: 'Pendiente'}, {value: 'pagada', label: 'Pagada'}]}
                                onChange={(value, setErr, setWarning) => {
                                    setVenta({
                                        ...venta,
                                        'Estado': value
                                    })
                                }}
                            />      
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
})

export default CreateInvoice