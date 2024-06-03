import React, { useState } from 'react'
import {TextField, TextArea, SelectField, ImgField, DateField} from '../../../Common/AwesomeFields/AwesomeFields'
import { IconButton, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IoPersonOutline } from "react-icons/io5";
import validateApi from '../../../../utils/textValidation';
import { handleConditionalCostValidation, handleFoundCostValidation, handleDoubleCostValidation } from '../../../../utils/Searching';
import '../../../Common/FormsCss/FormsCss.css'
import * as dateHelper from '../../../../utils/DatesHelper'
import axiosClient from '../../../../axios-client';


const handleRollbacks = (setRollbacks, label, bool) => {
    setRollbacks(prev=>(
        {
            ...prev,
            [label]: bool
        }
    ))
}

const AddCliente = React.memo((props)=>{

    const {
        clientes=[],
        setOpen
    } = props

const init = {
    'Nombre': '',
    'Apellido': '',
    'Mayorista': 'f',
    'Numero RUT': '',
    'Fecha de nacimiento': '',
    'Correo': '',
    'Telefono': '',
    'Direccion': ''
}

    const [nuevoCliente, setNuevoCliente] = useState(init)
    const [listFullSize, setListFullSize] = useState(false)
    const [markAsIncomplete, setMarkAsIncomplete] =  useState([])
    const [rollbacks, setRollbacks] = useState({
        'Fecha de nacimiento': '',
        'Fecha de nacimiento/RUT': false,
        'Correo': '',
        'Telefono': '',
      }) 


    const onRegistrar = () => {
        let rollback = false
        const required = ['Nombre', 'Apellido']
        const incompletes = []

        if (nuevoCliente['Mayorista'] === 't') {
            required.push('Fecha de nacimiento')
            required.push('Numero RUT')
        } 

        for (let require of required) {
            if (!!!nuevoCliente[require] || nuevoCliente[require] === '' || nuevoCliente[require] === 'empty') {
              incompletes.push(require)
            }
        }

        if (incompletes.length > 0) {
            setMarkAsIncomplete(incompletes)
            rollback = true
        }
        
        if (rollback) return
        else {
            // Crear objeto con el formato de keys que espera el backend
            const newUser = {
                'Nombre': nuevoCliente['Nombre'],
                'Apellido': nuevoCliente['Apellido'],
                'Telefono': nuevoCliente['Telefono'],
                'horaRegistro': dateHelper.getCurentTime(),
                'cargoId': '14',
                'numeroRut': nuevoCliente['Numero RUT'],
                'email': nuevoCliente['Correo'],
                'direccion': nuevoCliente['Direccion'],
                'fechaNacimiento': nuevoCliente['Fecha de nacimiento'],
                'fechaRegistro': dateHelper.getCurrentDate(),
                'activo': 't'
            }

            axiosClient.post('/register', {...newUser})
                .then(({ data }) => {
                    console.log(data)
                })
                .catch(error=>{
                    const messageErr = error.response.data.messageError
                    console.log(error)
                })
        }
    }

    return (
        <div className='containerRight'>
            <div className='formCarritoRight'>

                <div className='exitRight'>
                    <IconButton  onClick={() => setOpen(false)}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>

                    {/** Header */}
                <div>            
                        <div className='mainData'>
                            <div className='TitleContainer'>
                                <div className='Title'>
                                    <h3>Registro cliente</h3>
                                    <span style={{
                                    background: '#FFF9D0',
                                    color: '#DBBD15',
                                    }}><IoPersonOutline /></span>
                                </div>
                            </div>
                        </div>
                </div>

                <div className='mainData'>
                    <Divider />
                </div>

                <div className='mainData'>
                    <TextField 
                        label='Nombre'
                        incomplete={markAsIncomplete.find(l=>l=='Nombre')}
                        placeholder='Obligatorio'
                        value={nuevoCliente['Nombre']}
                        onChange={(value, setErr, setWarning)=>{
                            if (validateApi.name(value)) {
                                setNuevoCliente({
                                    ...nuevoCliente,
                                    'Nombre': value
                                })
                            }
                        }}
                    />
                </div>

                <div className='mainData'>
                    <TextField 
                        label='Apellido'
                        placeholder='Obligatorio'
                        value={nuevoCliente['Apellido']}
                        incomplete={markAsIncomplete.find(l=>l=='Apellido')}
                        onChange={(value, setErr, setWarning)=>{
                            if (validateApi.name(value)) {
                                setNuevoCliente({
                                    ...nuevoCliente,
                                    'Apellido': value
                                })
                            }
                        }}
                    />
                </div>

                <div className='mainData'>
                    <TextField 
                        label='Correo'
                        placeholder='Opcional'
                        value={nuevoCliente['Correo']}
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
                                    
                            setNuevoCliente({
                                ...nuevoCliente,
                                'Correo': value
                            })
                        }}
                    />
                </div>
                
                <div className='mainData'>
                    <SelectField 
                        label='Es un cliente mayorista'
                        value={nuevoCliente['Mayorista']}
                        options={[{label:'No', value:'f'}, {label: 'Si', value: 't'}]}
                        onChange={(value)=>{
                            setNuevoCliente({
                                ...nuevoCliente,
                                'Mayorista': value
                            })
                        }}
                    />
                </div>

                <div style={{display: nuevoCliente['Mayorista'] === 't' ? '' : 'none'}}>
                    <div className='mainData'>
                        <DateField 
                            label='Fecha de nacimiento del colaborador'
                            placeholder='Obligatorio'
                            value={nuevoCliente['Fecha de nacimiento']}
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

                                setNuevoCliente({
                                    ...nuevoCliente,
                                    'Fecha de nacimiento': value
                                })
                                
                            }}
                        />
                    </div>
                    <div className='mainData'>
                        <TextField 
                            label='Numero RUT'
                            placeholder='Obligatorio'
                            value={nuevoCliente['Numero RUT']}
                            onChange={(value)=> {
                                if (validateApi.numeric(value)) {
                                    setNuevoCliente({
                                        ...nuevoCliente,
                                        'Numero RUT': value
                                    })
                                }
                            }}
                        />
                    </div>
                </div>
                
                <div className='mainData'>
                    <TextField 
                        label='Telefono'
                        placeholder='Opcional'
                        value={nuevoCliente['Telefono']}
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
                                setNuevoCliente({
                                    ...nuevoCliente,
                                    'Telefono': value
                                })
                            }
                        }}
                    />
                </div>

                <div className='mainData'>
                    <TextArea 
                        label='Direccion'
                        placeholder='Opcional'
                        value={nuevoCliente['Direccion']}
                        onChange={(value)=> {
                            setNuevoCliente({
                                ...nuevoCliente,
                                'Direccion': value
                            })
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
)

export default AddCliente