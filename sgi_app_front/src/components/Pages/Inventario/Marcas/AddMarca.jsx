import React, { useState } from 'react'
import { IconButton, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../../Common/FormsCss/FormsCss.css'
import {TextField} from '../../../Common/AwesomeFields/AwesomeFields'
import validateApi from '../../../../utils/textValidation'
import {handleFoundCostValidation} from '../../../../utils/Searching'
import axiosClient from '../../../../axios-client';

const AddMarca = (props) => {
    const {
        setOpen,
        marcas=[]
    } = props
    
    const  [marca, setMarca] = useState('')
    const  [rollback, setRollback] = useState(false)
    const  [markAsIncomplete, setMarkAsIncomplete] = useState([])

    const onRegistrar = () => {
        let roll = false
        const incompletes = []
        if (marca === '') {
            incompletes.push('Marca')
            roll = true   
        }
        
        setMarkAsIncomplete(incompletes)
        
        if (rollback) roll = true

        if (roll) return
        else axiosClient.post('/marca', {marca: marca})
        .then(({data}) => {
          const Marca = data.data
          const value = Marca.value.val
          const label = Marca.label.label
          marcas.unshift({value, label})
        })
        .catch(error => {
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
                        value={marca}
                        incomplete={markAsIncomplete.find(l=>l==='Marca')}
                        label='Nueva marca'
                        placeholder='Obligatorio'
                        onChange={(value, setErr, setWarning)=>{
                            handleFoundCostValidation(marcas, 'label', value, 
                                ()=>{
                                    setWarning('Marca ya existente')
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

export default AddMarca