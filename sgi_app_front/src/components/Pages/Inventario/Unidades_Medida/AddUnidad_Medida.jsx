import React, { useState } from 'react'
import { IconButton, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../../Common/FormsCss/FormsCss.css'
import {TextField} from '../../../Common/AwesomeFields/AwesomeFields'
import validateApi from '../../../../utils/textValidation'
import {handleFoundCostValidation} from '../../../../utils/Searching'
import axiosClient from '../../../../axios-client';

const Unidades_Medida = (props) => {
    const {
        setOpen,
        medidas=[]
    } = props
    
    const  [medida, setMarca] = useState('')
    const  [rollback, setRollback] = useState(false)
    const  [markAsIncomplete, setMarkAsIncomplete] = useState([])

    const onRegistrar = () => {
        let roll = false
        const incompletes = []
        if (medida === '') {
            incompletes.push('Medida')
            roll = true   
        }
        
        setMarkAsIncomplete(incompletes)
        
        if (rollback) roll = true

        if (roll) return
        else axiosClient.post('/unidad_medida', {medida: medida})
        .then(({data}) => {
          alert('Bien hecho')
          const Medida = data.data
          const value = Medida.value.val
          const label = Medida.label.label
          medidas.unshift({value, label})
        })
        .catch(error => {
          alert('Mal')
          const messageError = error.response.data
          console.log(messageError);
        })

    }

    return (
        <div className='containerRight'>
            <div className='formCarritoRight'>
                <div className='exitRight'>
                    <IconButton  onClick={() => setOpen(false)}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>
                <div className='mainData'>
                    <TextField 
                        value={medida}
                        incomplete={markAsIncomplete.find(l=>l==='Medida')}
                        label='Nueva unidad de medida'
                        placeholder='Obligatorio'
                        onChange={(value, setErr, setWarning)=>{
                            handleFoundCostValidation(medidas, 'label', value, 
                                ()=>{
                                    setWarning('Unidad de medida ya existente')
                                    setRollback(true)
                                },
                                () => {
                                    setWarning('')
                                    setRollback(false)
                                }
                            )
                            setMarca(value)
                        }}
                    />
                </div>
            </div>
            <button 
                className='btnAgregarRight vw30'
                onClick={()=>onRegistrar()}
            >Registrar</button>
        </div>
    )
}

export default Unidades_Medida