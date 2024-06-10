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
import { addOnList, restOnList, deleteFromList } from '../Helpers/Aritmethics'

const CarritoFacturacion = ({
    limit=false,
    tipo,
    onClose,
    listaDetalles = [],
    setListaDetalles = () => null,
    productos = [],
    subtotal = 0,
    total = 0
}) => {


    const [emptyFields, setEmptyFields] = useState([])
    const [rollbacks, setRollbacks] = useState({
        'CantidadIsZero': [],
        'Cantidad': [],
        'Cantidad con descuento': [],
        'Porcentaje de descuento': []
    })

   

    const validateInputs = () => {
        const required = ['Cantidad', `Precio de ${tipo==='orden'?'compra':'venta'}`]
        const empty = []
        let rollback = false

        for (let detalle of listaDetalles) {
            for (let req of required) {
                if (detalle[req] === '') empty.push(req)
            }
        }

        setEmptyFields(empty)

        if (empty.length > 0) {
            rollback = true
        }

        // Validar que no exista ningun rollback
        // Revisar si se hara un rollback logico
        for (let rollback of Object.keys(rollbacks)) {
            if (rollbacks[rollback].length>0) return // Si al menos existe un error logico realizar rollback
        }

        if (rollback) {
            return null
        } else {
            onClose()
        }
    }

    const handleConditionalCostValidation = (constraint, validation, key) => {
        if (validation()) {
            if (rollbacks[constraint].findIndex(k=>k===key) === -1) {
                setRollbacks({ // Join discreto
                    ...rollbacks,
                    [constraint]: [...rollbacks[constraint], key]
                })
            }
        }  else {
            const index = rollbacks[constraint].findIndex(k=> k === key)
            if (index!==-1) {
                const updated1 = [...rollbacks[constraint].slice(0, index), ...rollbacks[constraint].slice(index+1)]
                setRollbacks({ // Diferencia con XOR
                    ...rollbacks,
                    [constraint]: updated1
                })
            }
        }
    }

    const handleDoubleCostValidation = debounce((constraint1, constraint2, validation, key) => {
        if (validation(constraint1.value, constraint2.value)) {
            if (rollbacks[constraint1.label].findIndex(k=>k===key) === -1 && rollbacks[constraint2.label].findIndex(k=>k===key) === -1 ) {
                setRollbacks({ // Join discreto
                    ...rollbacks,
                    [constraint1.label]: [...rollbacks[constraint1.label], key],
                    [constraint2.label]: [...rollbacks[constraint2.label], key]
                })
            }
        } else {
            const index1 = rollbacks[constraint1.label].findIndex(k=> k === key)
            const index2 = rollbacks[constraint2.label].findIndex(k=> k === key)
            if (index1!==-1 && index2!==-1) {
                const updated1 = [...rollbacks[constraint1.label].slice(0, index1), ...rollbacks[constraint1.label].slice(index1+1)]
                const updated2 = [...rollbacks[constraint2.label].slice(0, index2), ...rollbacks[constraint2.label].slice(index2+1)]
                setRollbacks({ // Diferencia con XOR
                    ...rollbacks,
                    [constraint1.label]: updated1,
                    [constraint2.label]: updated2
                })
            }
        }
    }, 300)


    const onHandleChange = (label, value, index) => {
        setListaDetalles(prev => {
            if (limit && (label === 'Cantidad' || label === 'Cantidad con descuento')) {
                const cantidadDisponible = Number(prev[index]['Disponible'])
                const cantidad = Number(value)
                if (cantidadDisponible < cantidad) return prev
            } 
            const updated = [...prev]
            const editable = { ...prev[index] }
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
                <IconButton onClick={validateInputs}>
                    <UilTimes />
                </IconButton>
                <h6>Mi factura</h6>
            </div>

            <div className='facturaRight'>
                {listaDetalles.map((detalle, index) => {
                    let nombre = ''
                    let imagen = ''
                    if (!!!detalle.id.startsWith('new')) {
                        nombre = productos.find(p => String(p.value) === String(detalle.id)).info['Nombre']
                        imagen = productos.find(p => String(p.value) === String(detalle.id)).info['Imagen']
                    } else {
                        nombre = detalle['Nombre'] + ' (Nuevo!)'
                        imagen = detalle['Imagen']
                    }
                    return <div className='itemRight'>
                        <div className='infoItem'>
                            <Avatar sx={{
                                width: '60px',
                                height: '60px'
                            }} src={isHex(imagen) ? hexToDataURL(imagen) : base64(imagen)} />
                            <p>{nombre}</p>
                            <IconButton onClick={()=>deleteFromList(setListaDetalles, listaDetalles.length, detalle.id)}>
                                <MdDelete />
                            </IconButton>
                        </div>

                        <div className='inputItem'>
                            <div className='secondaryData s'>
                                <TextField
                                    desactiveManually={!rollbacks['Cantidad']}
                                    incomplete={emptyFields.find(field => field === 'Cantidad')}
                                    label='Cantidad'
                                    value={detalle['Cantidad']}
                                    onChange={(value, setErr, setWarning) => {
                                        const cantidad = Number(value)
                                        handleConditionalCostValidation('CantidadIsZero', ()=>cantidad<1, detalle.id)
                                        handleDoubleCostValidation({ label: 'Cantidad', value: cantidad }, { label: 'Cantidad con descuento', value: Number(detalle['Cantidad con descuento']) }, (val1, val2) => {
                                            if (val1 < val2) {
                                                return true
                                            } else {
                                                return false
                                            }
                                        }, detalle.id)

                                        if (validateApi.number(value)) onHandleChange('Cantidad', value, index)
                                    }}
                                />
                                <Adder
                                   onPlus={() => addOnList(setListaDetalles, listaDetalles.length, 'Cantidad', detalle.id, detalle['Disponible'])}
                                   onMinus={() => restOnList(setListaDetalles, listaDetalles.length, 'Cantidad', detalle.id)}
                                />
                                <TextField
                                    type='price'
                                    incomplete={emptyFields.find(field => field === `Precio de ${tipo==='orden'?'compra':'venta'}`)}
                                    label='Precio'
                                    value={detalle[`Precio de ${tipo==='orden'?'compra':'venta'}`]}
                                    onChange={(value, setErr, setWarning) => {
                                        if (validateApi.positiveReal(value) && validateApi.priceTruncated(value)) {
                                            onHandleChange(`Precio de ${tipo==='orden'?'compra':'venta'}`, value, index)
                                        }
                                    }}
                                />
                                <Adder
                                    onPlus={() => addOnList(setListaDetalles, listaDetalles.length, `Precio de ${tipo==='orden'?'compra':'venta'}`, detalle.id)}
                                    onMinus={() => restOnList(setListaDetalles, listaDetalles.length, `Precio de ${tipo==='orden'?'compra':'venta'}`, detalle.id)}
                                />
                            </div>
                            <div className='secondaryData s'>
                                <TextField
                                    label='Con descuento'
                                    value={detalle['Cantidad con descuento']}
                                    desactiveManually={!rollbacks['Cantidad con descuento']}
                                    onChange={(value, setErr, setWarning) => {
                                        const cantidad = Number(value)
                                        handleDoubleCostValidation({ label: 'Cantidad con descuento', value: cantidad }, { label: 'Cantidad', value: Number(detalle['Cantidad']) }, (val1, val2) => {
                                            if (val1 > val2) {
                                                return true
                                            } else {
                                                return false
                                            }
                                        }, detalle.id)
                                        if (validateApi.positiveIntegerOrZero(value)) onHandleChange('Cantidad con descuento', value, index)

                                    }}
                                />
                                <Adder
                                    onPlus={() => addOnList(setListaDetalles, listaDetalles.length, 'Cantidad con descuento', detalle.id, detalle['Disponible'])}
                                    onMinus={() => restOnList(setListaDetalles, listaDetalles.length, 'Cantidad con descuento', detalle.id)}
                                />
                                <TextField
                                    label='Porcentaje'
                                    blocked={Number(detalle['Cantidad con descuento'])===0}
                                    value={detalle['Porcentaje de descuento']}
                                    onChange={(value, setErr, setWarning) => {
                                        if (validateApi.positiveReal(value) &&
                                            validateApi.priceTruncated(value) &&
                                            Number(value) < 100) onHandleChange('Porcentaje de descuento', value, index)
                                    }}
                                />
                                <Adder
                                    blocked={Number(detalle['Cantidad con descuento'])===0}
                                    onPlus={() => addOnList(setListaDetalles, listaDetalles.length, 'Porcentaje de descuento', detalle.id)}
                                    onMinus={() => restOnList(setListaDetalles, listaDetalles.length, 'Porcentaje de descuento', detalle.id)}
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
                <button
                    onClick={validateInputs}
                    className='btnContinuarFactura'>
                    Continuar con la orden
                </button>
            </div>

        </div>
    }
}

export default CarritoFacturacion