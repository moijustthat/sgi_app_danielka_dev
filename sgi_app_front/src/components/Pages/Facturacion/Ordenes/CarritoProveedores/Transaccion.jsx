import React, {useState} from 'react'
import { Grid } from '@mui/material'
import hexToDataURL from '../../../../../utils/HexToDataUrl'
import defaultImg from '../../../../../imgs/logo.png'
import './Transaccion.css'
import { TextField } from '../../../../Common/AwesomeFields/AwesomeFields'
import {Button} from '@mui/material'
import validateApi from '../../../../../utils/textValidation'
import { debounce } from 'lodash'



const handleNewTransaccion = (field, value, setNewTransaccion) => {
    setNewTransaccion(prev=>({
        ...prev,
        [field]: value
    }))
}

const Transaccion = ({
    producto,
    marca,
    categoria,
    medida,
    onAddCarrito,
    onClose
}) => {
    const init = {
        id: producto.id,
        Cantidad: '',
        'Precio de compra': '',
        'Cantidad con descuento': ''
    }
    const [newTransaccion, setNewTransaccion] = useState(init)
    const [rollbacks, setRollbacks] = useState({
        'Cantidad': false,
        'Cantidad con descuento': false,
        'Porcentaje con descuento': false
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

    return  <Grid container spacing={2}>
                <Grid item xs={6}>
                    <div className='marco'>
                        <img className='imgMarco' src={producto['Imagen'] ? hexToDataURL(producto['Imagen']) : defaultImg} />
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div className='infoTransaccion'>
                        <p>{marca.toUpperCase()}</p>
                        <p>{producto['Nombre'].toUpperCase()}</p>
                        <p>{`Presentacion: ${medida}`}</p>
                        <p>{`Codigo: ${producto['Codigo de barra']}`}</p>
                    </div>        
                    <div className='fieldsTransaccion'>
                        <div className='secondaryData'>
                            <TextField 
                                value={newTransaccion['Cantidad']}
                                desactiveManually={!rollbacks['Cantidad']}
                                label='Cantidad'
                                onChange={(value, setErr, setWarning)=> {
                                    const cantidad = Number(value)
                                    handleDoubleCostValidation({label: 'Cantidad', value: cantidad}, {label:'Cantidad con descuento', value: Number(newTransaccion['Cantidad con descuento'])}, (val1, val2) => {
                                        if (val1 < val2) {
                                            setWarning('Cantidad inferior a la del descuento')
                                            return true
                                        } else {
                                            setWarning('')
                                            return false
                                        }
                                    })
                                    if (validateApi.number(value)) handleNewTransaccion('Cantidad', value, setNewTransaccion)
                                }}
                            />
                            <TextField 
                                value={newTransaccion['Precio de compra']}
                                label='Precio de compra'
                                onChange={(value)=> {
                                    if (validateApi.positiveReal(value) && validateApi.priceTruncated(value)) handleNewTransaccion('Precio de compra', value, setNewTransaccion)
                                }}
                            />
                        </div>
                        <div className='secondaryData'>
                            <TextField 
                                value={newTransaccion['Cantidad con descuento']}
                                desactiveManually={!rollbacks['Cantidad con descuento']}
                                label='Cantidad con descuento'
                                onChange={(value, setErr, setWarning)=> {
                                    const cantidad = Number(value)
                                    handleDoubleCostValidation({label: 'Cantidad con descuento', value: cantidad}, {label:'Cantidad', value: Number(newTransaccion['Cantidad'])}, (val1, val2) => {
                                        if (val1 > val2) {
                                            setWarning('Esta cantidad sobrepasa a la de tu orden')
                                            return true
                                        } else {
                                            setWarning('')
                                            return false
                                        }
                                    })
                                    if (validateApi.positiveIntegerOrZero(value)) handleNewTransaccion('Cantidad con descuento', value, setNewTransaccion)
                                }}
                            />
                            <TextField 
                                value={newTransaccion['Porcentaje con descuento']}
                                desactiveManually={!rollbacks['Porcentaje con descuento']}
                                label='Porcentaje con descuento'
                                onChange={(value, setErr, setWarning)=> {
                                    if (validateApi.positiveReal(value) &&
                                        validateApi.priceTruncated(value) &&
                                        Number(value) < 100) handleNewTransaccion('Porcentaje con descuento', value, setNewTransaccion)
                                }}
                            />
                        </div>
                        <div className='secondaryData'>
                            <Button
                                sx={{
                                    background: '#7C6EBB !important'
                                }}
                                onClick={()=>onAddCarrito(Number(newTransaccion['Cantidad']), newTransaccion)}
                            >
                                Añadir a la factura 
                            </Button>
                            <Button
                                sx={{
                                    background: '#EB789A !important'
                                }}
                                onClick={onClose}
                            >
                                Atras
                            </Button>
                        </div>
                    </div>         
                </Grid>
            </Grid>
}

export default Transaccion