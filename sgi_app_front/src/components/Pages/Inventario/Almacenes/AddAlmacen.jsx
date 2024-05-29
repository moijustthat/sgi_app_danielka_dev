import React, { useState } from 'react'
import { TextField, SelectField } from '../../../Common/AwesomeFields/AwesomeFields'
import Title from '../../../Common/Title/Title'
import { MdOutlineWarehouse } from "react-icons/md";
import { Divider, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../../Common/FormsCss/FormsCss.css'
import { handleFoundCostValidation } from '../../../../utils/Searching'

const init = {
    'Nombre': '',
    'Piso': '',
    'Sala': '',
    'Ancho': '',
    'Alto': '',
    'Longitud': ''
}

const AddAlmacen = (props) => {

    const {
        setOpen=()=>null,
        almacenes=[]
    } = props

    const [markAsIncomplete, setMarkAsIncomplete] = useState([])
    const [nuevoAlmacen, setNuevoAlmacen] = useState(init)
    const [rollbacks, setRollbacks] = useState({
        'Nombre': false,
        'Ancho': false,
        'Alto': false,
        'Longitud': false
    })

    const onRegistro = () => {
        let cancel = false
        const required = ['Nombre', 'Piso', 'Sala', 'Ancho', 'Alto', 'Longitud']
        const incompletes = []
        // Verificar si hay campos vacios
        for (let require of required) {
            if (!nuevoAlmacen[require] || nuevoAlmacen[require] === '' || nuevoAlmacen[require] === 'empty') {
              incompletes.push(require)
            }
        }

        setMarkAsIncomplete(incompletes)

        if (incompletes.length > 0) cancel = true

        // Revisar si se hara un rollback logico
        for (let rollback of Object.keys(rollbacks)) { 
            if (rollbacks[rollback]) {
                cancel = true
                break
            } // Si al menos existe un error logico realizar rollback
        }

        if (cancel) return
        alert('Nuevo almacen creado en el front!!!')
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
                        title='Nuevo almacen'
                        icon={<MdOutlineWarehouse />}
                        description='Genera un nuevo almacen especificando su nombre, ubicacion y dimensiones'
                        background='#D9FFF1'
                        color='#21A97F'
                    />
                </div>

                <div className='mainData'>
                    <Divider />
                </div>

                <div className='mainData'>
                    <TextField 
                        incomplete={markAsIncomplete.find(l=>l==='Nombre')}
                        value={nuevoAlmacen['Nombre']}
                        label='Nombre del almacen'
                        placeholder='obligatorio'
                        onChange={(value, setErr, setWarning)=>{
                            handleFoundCostValidation(almacenes, 'Nombre', value, 
                                ()=>{
                                   setRollbacks({
                                    ...rollbacks,
                                    'Nombre': true
                                   }) 
                                   setWarning('Nombre ya en uso')
                                },
                                ()=>{
                                    setRollbacks({
                                        ...rollbacks,
                                        'Nombre': false
                                       }) 
                                    setWarning('')
                                }
                            )
                            setNuevoAlmacen({
                                ...nuevoAlmacen,
                                'Nombre': value
                            })
                        }}
                    />
                </div>
            </div>
            <button 
                onClick={onRegistro}
                className='btnAgregarRight'>
                Generar nuevo almacen
            </button>
        </div>
    )
}

export default AddAlmacen