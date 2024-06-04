import React, {useState} from 'react'
import { Grid } from '@mui/material'
import { TextField } from '../../../Common/AwesomeFields/AwesomeFields'
import {Button} from '@mui/material'
import { handleConditionalCostValidation } from '../../../../utils/Searching'
import { handleDoubleCostValidation } from '../../../../utils/Searching'
import validateApi from '../../../../utils/textValidation'
import './Abonos.css'
import axiosClient from '../../../../axios-client'

const Abonos = ({
    factura,
    tipo,
    close
}) => {

    const [monto, setMonto] = useState('')
    const [pagado, setPagado] = useState('')
    const [markAsIncomplete, setMarkAsIncomplete] = useState([])
    const [rollbacks, setRollbacks] = useState({
        'monto/pagado': false,
        'pagado/monto': false
    })

    const onAbonar = () => {
        let rollback = false
        const incompletes = []
        
        if (monto === '')  incompletes.push('monto')
        if (pagado === '') incompletes.push('pagado')
        setMarkAsIncomplete(incompletes)
        if (incompletes.length > 0) rollback = true

        // Revisar si se hara un rollback logico
        for (let key of Object.keys(rollbacks)) { 
            if (rollbacks[key]) rollback = true // Si al menos existe un error logico realizar rollback
        }

        if (rollback) return
        else {
            const payload = {facturaId: factura.id, abono: monto}
            axiosClient.post(`/abono/${tipo}`, payload)
                .then(({data})=>{
                    const response = data.message
                    alert(response)
                })
                .catch(error=>{
                    console.log(error)
                })
        }   

    }

    const debido = (Number(factura['Debido']) - Number(monto)).toFixed(2)
    const cambio = pagado!==''&&monto!==''?(Number(pagado) - Number(monto)).toFixed(3):0
    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <TextField 
                    desactiveManually={!!!rollbacks['monto/pagado']}
                    incomplete={markAsIncomplete.find(l=>l=='monto')}
                    value={monto}
                    label='Monto abonado'
                    placeholder='C$'
                    onChange={(value, setErr, setWarning)=>{
                        if(validateApi.positiveReal(value) && validateApi.priceTruncated(value) && Number(value) <= Number(factura['Total'])) {
                            handleDoubleCostValidation({value: Number(value), label: 'monto/pagado'}, {value:Number(pagado), label: 'pagado/monto'}, 
                            (monto, pagado)=>{
                                if ((monto > pagado) && pagado>0) {
                                    setWarning('Monto excede al pago')
                                    return true
                                } else {
                                    setWarning('')
                                    return false
                                }
                            },
                            setRollbacks
                        )
                            setMonto(value)
                        }
                    }}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField 
                    desactiveManually={!!!rollbacks['pagado/monto']}
                    incomplete={markAsIncomplete.find(l=>l=='pagado')}
                    value={pagado}
                    label='Monto pagado con'
                    placeholder='C$'
                    onChange={(value, setErr, setWarning)=>{
                        if( monto!=='' && validateApi.positiveReal(value) && validateApi.priceTruncated(value)) {
                            handleDoubleCostValidation({value: Number(value), label: 'pagado/monto'}, {value:Number(monto), label: 'monto/pagado'}, 
                            (pagado, monto)=>{
                                if ((pagado < monto)) {
                                    setWarning('Dinero insuficiente')
                                    return true
                                } else {
                                    setWarning('')
                                    return false
                                }
                            },
                            setRollbacks
                        )
                            setPagado(value)
                        }
                    }}
                />
            </Grid>
            <Grid item xs={4}>
                <div className='cambioBox'>
                    <label>Cambio</label>
                    <p>C$ {cambio}</p>
                </div>
            </Grid>
            <Grid item xs={8}>
                <div className='totalBox'>
                    <label>Total a pagar</label>
                    <p>C$ {factura['Total']}</p>
                </div>
            </Grid>
            <Grid item xs={4}>
                <Button onClick={onAbonar} sx={{
                    padding: '34px 56px'
                }} variant="contained" color="success">
                    Abonar
                </Button>
            </Grid>
            <Grid item xs={8}>
                <div className='totalBox'>
                    <label>Monto debido</label>
                    <p>C$ {debido}</p>
                </div>
            </Grid>
            <Grid item xs={4}>
                <Button onClick={close} sx={{
                    padding: '34px 42px'
                }} variant="outlined" color="error">
                    No abonar
                </Button>
            </Grid>
        </Grid>
    )
}

export default Abonos