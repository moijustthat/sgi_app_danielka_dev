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

const AddEmpleado = React.memo((props)=>{

    const {
        cargos=[],
        empleados=[],
        setOpen
    } = props

const init = {
    'Nombre': '',
    'Apellido': '',
    'Cargo': 'empty',
    'Fecha de nacimiento': '',
    'Correo': '',
    'Telefono': '',
    'Password': '',
    'Confirmar password': ''
}

    const [nuevoEmpleado, setNuevoEmpleado] = useState(init)
    const [listFullSize, setListFullSize] = useState(false)
    const [markAsIncomplete, setMarkAsIncomplete] =  useState([])
    const [rollbacks, setRollbacks] = useState({
        'Correo': false,
        'Correo/Formato': false,
        'Telefono': false,
        'Telefono/Formato': false,
        'Password': false,
        'Confirmar password': false,
        'Fecha de nacimiento': false
      }) 


    const onRegistrar = () => {
        let rollback = false
        const required = ['Nombre', 'Apellido', 'Correo', 'Cargo', 'Fecha de nacimiento', 'Password', 'Confirmar password']
        const incompletes = []
        for (let require of required) {
            if (!!!nuevoEmpleado[require] || nuevoEmpleado[require] === '' || nuevoEmpleado[require] === 'empty') {
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
                'Nombre': nuevoEmpleado['Nombre'],
                'Apellido': nuevoEmpleado['Apellido'],
                'Telefono': nuevoEmpleado['Telefono'],
                'horaRegistro': dateHelper.getCurentTime(),
                'cargoId': nuevoEmpleado['Cargo'],
                'email': nuevoEmpleado['Correo'],
                'password': nuevoEmpleado['Password'],
                'fechaNacimiento': nuevoEmpleado['Fecha de nacimiento'],
                'fechaRegistro': dateHelper.getCurrentDate(),
                'activo': 't'
            }

            axiosClient.post('register', {...newUser})
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
                                    <h3>Registro empleado</h3>
                                    <span style={{
                                    background: '#E8E1FF',
                                    color: '#5E3AE6',
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
                        value={nuevoEmpleado['Nombre']}
                        onChange={(value, setErr, setWarning)=>{
                            if (validateApi.name(value)) {
                                setNuevoEmpleado({
                                    ...nuevoEmpleado,
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
                        value={nuevoEmpleado['Apellido']}
                        incomplete={markAsIncomplete.find(l=>l=='Apellido')}
                        onChange={(value, setErr, setWarning)=>{
                            if (validateApi.name(value)) {
                                setNuevoEmpleado({
                                    ...nuevoEmpleado,
                                    'Apellido': value
                                })
                            }
                        }}
                    />
                </div>

                <div className='mainData'>
                    <TextField 
                        label='Correo'
                        placeholder='Obligatorio'
                        value={nuevoEmpleado['Correo']}
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
                                    empleados,
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
                                    
                            setNuevoEmpleado({
                                ...nuevoEmpleado,
                                'Correo': value
                            })
                        }}
                    />
                </div>

                <div className='mainData'>
                    <SelectField 
                        label='Cargo'
                        placeholder='Obligatorio'
                        incomplete={markAsIncomplete.find(l=>l=='Cargo')}
                        value={nuevoEmpleado['Cargo']}
                        options={[...cargos, {value:'empty', label: 'Seleccionar'}]}
                        onChange={(value)=> {
                            setNuevoEmpleado({
                                ...nuevoEmpleado,
                                'Cargo': value
                            })
                        }}
                    />
                </div>

                <div className='mainData'>
                    <DateField 
                        label='Fecha de nacimiento'
                        placeholder='Obligatorio'
                        value={nuevoEmpleado['Fecha de nacimiento']}
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

                            setNuevoEmpleado({
                                ...nuevoEmpleado,
                                'Fecha de nacimiento': value
                            })
                            
                        }}
                    />
                </div>

                <div className='mainData'>
                    <TextField 
                        label='Telefono'
                        placeholder='Opcional'
                        value={nuevoEmpleado['Telefono']}
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
                                    empleados,
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
                                setNuevoEmpleado({
                                    ...nuevoEmpleado,
                                    'Telefono': value
                                })
                            }
                        }}
                    />
                </div>

                <div className='mainData'>
                    <TextField 
                        password={true}
                        label='Password'
                        incomplete={markAsIncomplete.find(l=>l=='Password')}
                        desactiveManually={!!!rollbacks['Password']}
                        placeholder='Obligatorio'
                        value={nuevoEmpleado['Password']}
                        onChange={(value, setErr, setWarning)=>{
                            handleDoubleCostValidation( {label: 'Password', value: value}, {label: 'Confirmar password', value: nuevoEmpleado['Confirmar password']}, (val1, val2) => {
                                if(val1 !== val2) { 
                                  setWarning('Confirma la password')
                                  return true
                                }else {
                                  setWarning('')
                                  return false
                                }
                              }, setRollbacks
                            )

                            setNuevoEmpleado({
                                ...nuevoEmpleado,
                                'Password': value
                            })
                        }}
                    />
                </div>

                <div className='mainData'>
                    <TextField 
                        password={true}
                        label='Confirmar password'
                        desactiveManually={!!!rollbacks['Confirmar password']}
                        incomplete={markAsIncomplete.find(l=>l=='Confirmar password')}
                        placeholder='Obligatorio'
                        value={nuevoEmpleado['Confirmar password']}
                        onChange={(value, setErr, setWarning)=>{

                            handleDoubleCostValidation( {label: 'Confirmar password', value: value}, {label: 'Password', value: nuevoEmpleado['Password']}, (val1, val2) => {
                                if(val1 !== val2) { 
                                  setWarning('Password incorrecta')
                                  return true
                                }else {
                                  setWarning('')
                                  return false
                                }
                              }, setRollbacks
                            )

                            setNuevoEmpleado({
                                ...nuevoEmpleado,
                                'Confirmar password': value
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

export default AddEmpleado