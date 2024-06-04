import React, { useState } from 'react'
import { TextField, DateField, TextArea } from '../../../Common/AwesomeFields/AwesomeFields'
import * as DateHelper from '../../../../utils/DatesHelper'
import '../../../Common/FormsCss/FormsCss.css'
import { Divider } from '@mui/material'
import { FaPeopleRoof } from "react-icons/fa6";
import { Button } from '@mui/material'
import validateApi from '../../../../utils/textValidation'
import UpgradeIcon from '@mui/icons-material/Upgrade';
import axiosClient from '../../../../axios-client'


const FormMayoristas = ({id, close}) => {

    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [correo, setCorreo] = useState('')
    const [telefono, setTelefono] = useState('')
    const [fechaNacimiento, setFechaNacimiento] = useState('')
    const [rut, setRut] = useState('')
    const [direccion, setDirecction] = useState('')

    const onUpdate = () => {
        const payload = {
            'id': id,
            'Nombre': nombre,
            'Apellido': apellido,
            'email': correo,
            'Telefono': telefono,
            'fechaNacimiento': fechaNacimiento,
            'numeroRut': rut,
            'direccion': direccion
        }
        axiosClient.post('/cliente/mayorista', payload)
            .then(({data})=>{
                const response = data.message
                alert(response)
                close()
            })
            .catch(error=>{
                console.log(error)
            })
    }

    return (
        <div style={{
            background: '#FEF8F8'
        }} className='containerRight'>
            <div className='formCarritoRight'>
                <div>
                    <div className='mainData'>
                        <div className='TitleContainer'>
                            <div className='Title'>
                                <h3>Actualizar cliente mayorista</h3>
                                <span style={{
                                    background: '#FFF9D0',
                                    color: '#DBBD15',
                                }}><FaPeopleRoof /></span>
                            </div>
                        </div>
                    </div>

                    <div className='secondaryData'>
                        <TextField
                            value={nombre}
                            label='Nombre'
                            onChange={(value, setErr, setWarning) => {
                                if (validateApi.name(value)) {
                                    setNombre(value)
                                }
                            }}
                        />
                        <TextField
                            value={apellido}
                            label='Apellido'
                            onChange={(value, setErr, setWarning) => {
                                if (validateApi.name(value)) {
                                    setApellido(value)
                                }
                            }}
                        />
                    </div>

                    <div className='secondaryData'>
                        <TextField
                            value={correo}
                            label='Correo'
                            onChange={(value, setErr, setWarning) => {
                                setCorreo(value)
                            }}
                        />
                        <TextField
                            value={telefono}
                            label='Telefono'
                            onChange={(value, setErr, setWarning) => {
                                setTelefono(value)
                            }}
                        />
                    </div>

                    <div className='secondaryData'>
                        <DateField
                            value={fechaNacimiento}
                            label='Fecha de nacimiento'
                            onChange={(value, setErr, setWarning) => {
                                if (DateHelper.isLesser(value, DateHelper.getCurrentDate())) {
                                    setFechaNacimiento(value)
                                }
                            }}
                        />
                        <TextField
                            value={rut}
                            label='Numero RUT'
                            onChange={(value, setErr, setWarning) => {
                                if (validateApi.numeric(value) && value.length <= 15) {
                                    setRut(value)
                                }
                            }}
                        />
                    </div>

                    <div className='mainData'>
                        <TextArea
                            value={direccion}
                            label='Direccion'
                            onChange={(value, setErr, setWarning) => {
                                setDirecction(value)
                            }}
                        />
                    </div>

                    <div className='mainData'>
                        <Button onClick={onUpdate} color='secondary' variant="contained" startIcon={<UpgradeIcon />}>
                            Actualizar
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default FormMayoristas