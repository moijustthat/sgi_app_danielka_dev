import React, { useState } from 'react'
import { IconButton, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../../Common/FormsCss/FormsCss.css'
import {TextField} from '../../../Common/AwesomeFields/AwesomeFields'
import validateApi from '../../../../utils/textValidation'
import {handleFoundCostValidation} from '../../../../utils/Searching'
import axiosClient from '../../../../axios-client';

const AddCategoria = (props) => {
    const {
        setOpen,
        categorias=[]
    } = props
    
    const  [categoria, setCategoria] = useState('')
    const  [rollback, setRollback] = useState(false)
    const  [markAsIncomplete, setMarkAsIncomplete] = useState([])

    const onRegistrar = () => {
        let roll = false
        const incompletes = []
        if (categoria === '') {
            incompletes.push('Categoria')
            roll = true   
        }
        
        setMarkAsIncomplete(incompletes)
        
        if (rollback) roll = true

        if (roll) return
        else axiosClient.post('/categoria', {categoria: categoria})
        .then(({data}) => {
          alert('Bien hecho')
          const Categoria = data.data
          const value = Categoria.value.val
          const label = Categoria.label.label
          categorias.unshift({value, label})
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
                        value={categoria}
                        incomplete={markAsIncomplete.find(l=>l==='Categoria')}
                        label='Nueva categoria'
                        placeholder='Obligatorio'
                        onChange={(value, setErr, setWarning)=>{
                            handleFoundCostValidation(categorias, 'label', value, 
                                ()=>{
                                    setWarning('Categoria ya existente')
                                    setRollback(true)
                                },
                                () => {
                                    setWarning('')
                                    setRollback(false)
                                }
                            )
                            setCategoria(value)
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

export default AddCategoria