import React, { useState } from 'react'
import { TextField, DateField, TextArea } from '../../../Common/AwesomeFields/AwesomeFields'
import * as DateHelper from '../../../../utils/DatesHelper'
import '../../../Common/FormsCss/FormsCss.css'
import { Divider } from '@mui/material'
import { IoPeopleOutline } from "react-icons/io5";
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { Button } from '@mui/material'
import validateApi from '../../../../utils/textValidation'
import axiosClient from '../../../../axios-client'

const FormComerciales = ({id, close, refresh}) => {

    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [correo, setCorreo] = useState('')
    const [telefono, setTelefono] = useState('')
    const [direccion, setDireccion] = useState('')

    const onUpdate = () => {
      const payload = {
          'id': id,
          'Nombre': nombre,
          'Apellido': apellido,
          'email': correo,
          'Telefono': telefono,
          'direccion': direccion
      }
      axiosClient.post('/cliente/comercial', payload)
          .then(({data})=>{
              const response = data.message
              alert(response)
              refresh()
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
                                <h3>Actualizar cliente comercial</h3>
                                <span style={{
                                    background: '#FFF9D0',
                                    color: '#DBBD15',
                                }}><IoPeopleOutline /></span>
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
                              if (validateApi.everything(value)) {
                                  setCorreo(value)
                              }
                          }}
                        />
                        <TextField 
                            value={telefono}
                            label='Telefono'
                            onChange={(value, setErr, setWarning) => {
                              if (validateApi.name(value)) {
                                  setTelefono(value)
                              }
                          }}
                        />
                    </div>

                    <div className='mainData'>
                        <TextArea 
                            value={direccion}
                            label='Direccion'
                            onChange={(value, setErr, setWarning) => {
                              if (validateApi.name(value)) {
                                  setDireccion(value)
                              }
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

export default FormComerciales