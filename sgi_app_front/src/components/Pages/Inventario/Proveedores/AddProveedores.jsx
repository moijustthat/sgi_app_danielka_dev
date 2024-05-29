import '../../../Common/FormsCss/FormsCss.css'
import React, { useState } from 'react'
import { Divider, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TextField, TextArea } from '../../../Common/AwesomeFields/AwesomeFields'
import { handleFoundCostValidation, handleConditionalCostValidation, handleRollbacks } from '../../../../utils/Searching'
import validateApi from '../../../../utils/textValidation';
import Title from '../../../Common/Title/Title';
import { UilStore } from '@iconscout/react-unicons'
import axiosClient from '../../../../axios-client';

const init = {
    'Razon Social': '',
    'Numero RUT': '',
    'Correo': '',
    'Telefono': '',
    'Direccion': '',
    'activo': 't'    
}

const AddProveedores = (props) => {
    const {
        proveedores=[],
        setOpen=()=>null
    } = props

    const [markAsIncomplete, setMarkAsIncomplete] = useState([])
    const [nuevoProveedor, setNuevoProveedor] = useState(init)
    const [rollbacks, setRollbacks] = useState({
        'Razon Social': false,
        'Numero RUT': false,
        'Correo/Formato': false,
        'Correo': false,
        'Telefono': false
    })
        
    const onRegistro = () => {
        let cancel = false
        const required = ['Razon Social', 'Numero RUT', 'Telefono', 'Direccion']
        const incompletes = []
        // Verificar si hay campos vacios
        for (let require of required) {
            if (!nuevoProveedor[require] || nuevoProveedor[require] === '' || nuevoProveedor[require] === 'empty') {
              incompletes.push(require)
            }
        }

        setMarkAsIncomplete(incompletes)

        if (incompletes.length > 0) cancel = true // Si existe al menos un campo vacio hacer rollback

        // Revisar si se hara un rollback logico
        for (let rollback of Object.keys(rollbacks)) { 
            if (rollbacks[rollback]) {
                cancel = true
                break
            } // Si al menos existe un error logico realizar rollback
        }

        if (cancel) return
        else axiosClient.post('/proveedor', {proveedor: nuevoProveedor})
                .then(({data})=>{
                    console.log(data)
                })
                .catch(error=>{
                    console.log(error);
                })
    }

    return (
        <div className='containerRight'>
            <div className='formCarritoRight'>
                <div>
                    <IconButton onClick={() => setOpen(false)}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>

                <div className='mainData'>
                    <Title
                        title='Nuevo proveedor'
                        icon={<UilStore />}
                        description='Registro para un nuevo proveedor'
                        background='#E8E1FF'
                        color='#5E3AE6'
                    />
                </div>

                <div className='mainData'>
                    <TextField 
                        value={nuevoProveedor['Razon Social']}
                        label='Razon social'
                        incomplete={markAsIncomplete.find(l=>l=='Razon Social')}
                        onChange={(value, setErr, setWarning) => {
                        handleFoundCostValidation(
                        proveedores,
                        'Razon Social',
                        value,
                        ()=>{
                            setWarning('Razon social ya existente')
                            handleRollbacks(setRollbacks, 'Razon Social', true)
                        },
                        () => {
                            setWarning('')
                            handleRollbacks(setRollbacks, 'Razon Social', false)
                        }
                        )
                        setNuevoProveedor({
                            ...nuevoProveedor,
                            'Razon Social': value
                        })
                        }}
                    />
                </div>

                <div className='mainData'>
                    <TextField 
                        value={nuevoProveedor['Numero RUT']}
                        label='Numero RUT'
                        placeholder='*************'
                        onChange={(value, setErr, setWarning) => {
                            if (validateApi.numeric(value)) {
                                handleFoundCostValidation(
                                    proveedores,
                                    'Numero RUT',
                                    value,
                                    () => {
                                        setWarning('RUT encontrado en la base de datos')
                                        handleRollbacks(setRollbacks, 'Numero RUT', true)
                                    },
                                    () => {
                                        setWarning('')
                                        handleRollbacks(setRollbacks, 'Numero RUT', false)
                                    }
                                )

                                setNuevoProveedor({
                                    ...nuevoProveedor,
                                    'Numero RUT': value
                                })
                            }
                        }}
                    />
                </div>

                <div className='mainData'>
                    <TextField
                        value={nuevoProveedor['Correo']}
                        label='Correo'
                        onChange={(value, setErr, setWarning) => {

                            handleConditionalCostValidation(value, correo => validateApi.email(correo), () => {
                                setWarning('')
                                handleRollbacks(setRollbacks, 'Correo/Formato', false)
                            }, () => {
                                setWarning('Formato incorrecto')
                                handleRollbacks(setRollbacks, 'Correo/Formato', true)
                            })



                            if (!!!!!rollbacks['Correo/Formato']) {
                                handleFoundCostValidation(
                                    proveedores,
                                    'Correo',
                                    value,
                                    () => {
                                        setWarning('Correo encontrado en la base de datos')
                                        handleRollbacks(setRollbacks, 'Correo', true)
                                    },
                                    () => {
                                        setWarning('')
                                        handleRollbacks(setRollbacks, 'Correo', false)
                                    }
                                )
                            }


                            setNuevoProveedor({
                                ...nuevoProveedor,
                                'Correo': value
                            })
                        }}
                    />
                </div>

                <div className='mainData'>
                    <TextField
                        value={nuevoProveedor['Telefono']}
                        label='Telefono'
                        incomplete={markAsIncomplete.find(l => l == 'Telefono')}
                        onChange={(value, setErr, setWarning) => {
                            handleFoundCostValidation(
                                proveedores,
                                'Telefono',
                                value,
                                () => {
                                    setWarning('Telefono encontrado en la base de datos')
                                    handleRollbacks(setRollbacks, 'Telefono', true)
                                },
                                () => {
                                    setWarning('')
                                    handleRollbacks(setRollbacks, 'Telefono', false)
                                }
                            )
                            if (validateApi.numeric(value) && value.length <= 8) {
                                setNuevoProveedor({
                                    ...nuevoProveedor,
                                    'Telefono': value
                                })
                            }
                        }}
                    />
                </div>

                <div className='mainData'>
                    <TextArea
                        value={nuevoProveedor['Direccion']}
                        incomplete={markAsIncomplete.find(l => l == 'Direccion')}
                        label='Direccion'
                        onChange={(value, setErr) => {
                            setNuevoProveedor({
                                ...nuevoProveedor,
                                'Direccion': value
                            })
                        }}
                    />
                </div>

            </div>
            <button 
                onClick={onRegistro}
                className='btnAgregarRight'>
                Registrar nuevo nuevoProveedor
            </button>
        </div>
    )
}

export default AddProveedores