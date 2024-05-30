import { useState } from 'react'
import { debounce } from 'lodash'
import '../../../Common/FormsCss/FormsCss.css'
import './CarritoFacturacion.css'
import { UilTimes } from '@iconscout/react-unicons'
import React from 'react'
import { IconButton } from '@mui/material'
import logo from '../../../../imgs/avaLana.jpg'
import { Avatar } from '@mui/material'
import { MdDelete } from "react-icons/md";
import { TextField } from '../../../Common/AwesomeFields/AwesomeFields'
import Adder from '../../../Common/AlertDialog/Adder'
import hexToDataURL, { base64, isHex } from '../../../../utils/HexToDataUrl'
import { formatearNumeroConComas } from '../../../../utils/textValidation'
import validateApi from '../../../../utils/textValidation'

const CarritoFacturacion = ({
    onClose,
    listaDetalles = [],
    setListaDetalles = () => null,
    productos = [],
    subtotal=0,
    total=0
}) => {


    const [emptyFields, setEmptyFields] = useState([])
    const [rollbacks, setRollbacks] = useState({
        'Cantidad': false,
        'Cantidad con descuento': false,
        'Porcentaje de descuento': false
    })

    const handleDoubleCostValidation = debounce((constraint1, constraint2, validation) => {
        if (validation(constraint1.value, constraint2.value)) {
          setRollbacks({ // Join discreto
            ...rollbacks,
            [constraint1.label]: true,
            [constraint2.label]: true
          })
        } else {
          setRollbacks({ // Diferencia con XOR
            ...rollbacks,
            [constraint1.label]: false,
            [constraint2.label]: false
          })
        }
      }, 300)


    const onHandleChange = (label, value, index) => {
        setListaDetalles(prev=>{
            const updated = [...prev]
            const editable = {...prev[index]}
            editable[label] = value
            updated[index] = editable
            return updated
        })
    }

    if (listaDetalles.length < 1) {
        return <div>
            <div className='emptyHeaderFacturacion'>
                <IconButton onClick={onClose}>
                    <UilTimes />
                </IconButton>
                <h6>Mi factura</h6>
            </div>

            <div className='emptyMessage'>
                <p>¡ Tu factura esta vacia !</p>
            </div>

        </div>
    } else {
        return <div>
            <div className='emptyHeaderFacturacion'>
                <IconButton onClick={onClose}>
                    <UilTimes />
                </IconButton>
                <h6>Mi factura</h6>
            </div>

            <div className='facturaRight'>             
                {listaDetalles.map((detalle, index)=>{
                    let nombre = ''
                    let imagen = ''
                    if (!!!detalle.id.startsWith('new')) {
                         nombre = productos.find(p=>String(p.value) === String(detalle.id)).info['Nombre']
                         imagen = productos.find(p=>String(p.value) === String(detalle.id)).info['Imagen']
                    } else {
                        nombre = detalle['Nombre']
                        imagen = detalle['Imagen']
                        console.log(imagen)
                    }
                    return <div className='itemRight'>
                    <div className='infoItem'>
                        <Avatar sx={{
                            width: '60px',
                            height: '60px'
                        }} src={isHex(imagen) ? hexToDataURL(imagen) : base64(imagen)} />
                        <p>{nombre}</p>
                        <IconButton>
                            <MdDelete />
                        </IconButton>
                    </div>

                    <div className='inputItem'>
                        <div className='secondaryData s'>
                            <TextField 
                                desactiveManually={!rollbacks['Cantidad']}
                                incomplete={emptyFields.find(field=> field==='Cantidad')}
                                label='Cantidad' 
                                value={detalle['Cantidad']}
                                onChange={(value, setErr, setWarning)=>{
                                    const cantidad = Number(value)
                                    handleDoubleCostValidation({label: 'Cantidad', value: cantidad}, {label:'Cantidad con descuento', value: Number(detalle['Cantidad con descuento'])}, (val1, val2) => {
                                        if (val1 < val2) {
                                            return true
                                        } else {
                                            return false
                                        }
                                    })
                                    if (validateApi.number(value)) onHandleChange('Cantidad', value, index)   
                                }}
                            />
                            <Adder
                                onPlus={() => alert('sumar')}
                                onMinus={() => alert('restar')}
                            />
                            <TextField 
                                incomplete={emptyFields.find(field=> field==='Precio de compra')}
                                label='Precio' 
                                value={detalle['Precio de compra']}
                                onChange={(value, setErr, setWarning)=>{
                                    if (validateApi.positiveReal(value) && validateApi.priceTruncated(value)) {
                                        onHandleChange('Precio de compra', value, index)
                                    }
                                }}
                                />
                            <Adder
                                onPlus={() => alert('sumar')}
                                onMinus={() => alert('restar')}
                            />
                        </div>
                        <div className='secondaryData s'>
                            <TextField 
                                label='Con descuento' 
                                value={detalle['Cantidad con descuento']}
                                desactiveManually={!rollbacks['Cantidad con descuento']}
                                onChange={(value, setErr, setWarning)=>{
                                    const cantidad = Number(value)
                                    handleDoubleCostValidation({label: 'Cantidad con descuento', value: cantidad}, {label:'Cantidad', value: Number(detalle['Cantidad'])}, (val1, val2) => {
                                        if (val1 > val2) {
                                            return true
                                        } else {
                                            return false
                                        }
                                    })
                                    if (validateApi.positiveIntegerOrZero(value)) onHandleChange('Cantidad con descuento', value, index)
                                    
                                }}
                            />
                            <Adder
                                onPlus={() => alert('sumar')}
                                onMinus={() => alert('restar')}
                            />
                            <TextField 
                                label='Porcentaje' 
                                value={detalle['Porcentaje de descuento']}
                                onChange={(value, setErr, setWarning)=>{
                                    if (validateApi.positiveReal(value) &&
                                        validateApi.priceTruncated(value) &&
                                        Number(value) < 100) onHandleChange('Porcentaje de descuento', value, index)
                                }}
                            />
                            <Adder
                                onPlus={() => alert('sumar')}
                                onMinus={() => alert('restar')}
                            />
                        </div>
                    </div>

                </div>
                })}

            </div>
        
                <div className='infoFactura'>
                    <div className='totalFactura'>
                        <label>Subtotal</label>
                        <label>C$ {formatearNumeroConComas(subtotal)}</label>
                    </div>
                    <div className='totalFactura'>
                        <label>Total(Descuento aplicado)</label>
                        <label>C$ {formatearNumeroConComas(total)}</label>
                    </div>
                    <button className='btnContinuarFactura'>
                        Continuar con la orden
                    </button>
                </div>
                
        </div>
    }
}

export default CarritoFacturacion