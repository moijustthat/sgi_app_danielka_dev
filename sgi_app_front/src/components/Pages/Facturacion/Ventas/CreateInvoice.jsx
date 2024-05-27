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
        'Telefono': false,
        'Correo': false,
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
        // Crear un objeto que contenga los campos del proveedor y la venta
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

                    {/* Datos del proveedor*/}
                </div>
            </div>
        </div>
    )
})

export default CreateInvoice