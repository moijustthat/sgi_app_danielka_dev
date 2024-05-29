import React, { useState } from 'react'
import { TextField, SelectField } from '../../../Common/AwesomeFields/AwesomeFields'
import Title from '../../../Common/Title/Title'
import { MdOutlineWarehouse } from "react-icons/md";
import { Divider, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../../Common/FormsCss/FormsCss.css'
import { handleFoundCostValidation } from '../../../../utils/Searching'
import { IoLocationOutline } from "react-icons/io5";
import { RxDimensions } from "react-icons/rx";
import validateApi from '../../../../utils/textValidation';
import axiosClient from '../../../../axios-client';
const init = {
    'Nombre': '',
    'Piso': '1',
    'Sala': '1',
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
        else axiosClient.post('/almacen', {almacen: nuevoAlmacen})
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

                <div className='mainData'>
                    <Title 
                        title='Ubicacion'
                        icon={<IoLocationOutline />}
                        description='Ubicacion del almacen en la ferreteria'
                        background='#FDD5D6'
                        color='#EC3637'
                    />
                </div>

                <div className='mainData'>
                    <Divider />
                </div>

                <div className='mainData'>
                    <SelectField 
                        incomplete={markAsIncomplete.find(l=>l==='Piso')}
                        value={nuevoAlmacen['Piso']}
                        label='Piso'
                        options={[{value: 1, label: 'Piso 1'},{value: 2, label: 'Piso 2'}]}
                        onChange={(value)=>{
                            setNuevoAlmacen({
                                ...nuevoAlmacen,
                                'Piso': value
                            })
                        }}
                    />
                </div>

                <div style={{display: nuevoAlmacen['Piso'] === '1' ? '' : 'none'}} className='mainData'>
                    <SelectField 
                        incomplete={markAsIncomplete.find(l=>l==='Sala')}
                        value={nuevoAlmacen['Sala']}
                        label='Sala'
                        options={[{value: 1, label: 'Zona de ventas'},{value: 2, label: 'Sala A'},{value: 3, label: 'Sala B'}]}
                        onChange={(value)=>{
                            setNuevoAlmacen({
                                ...nuevoAlmacen,
                                'Sala': value
                            })
                        }}
                    />
                </div>

                <div style={{display: nuevoAlmacen['Piso'] === '2' ? '' : 'none'}} className='mainData'>
                    <SelectField 
                        incomplete={markAsIncomplete.find(l=>l==='Sala')}
                        value={nuevoAlmacen['Sala']}
                        label='Sala'
                        options={[{value: 4, label: 'Bodega A'},{value: 5, label: 'Bodega B'}]}
                        onChange={(value)=>{
                            setNuevoAlmacen({
                                ...nuevoAlmacen,
                                'Sala': value
                            })
                        }}
                    />
                </div>

                <div className='mainData'>
                    <Title 
                        title='Dimensiones'
                        icon={<RxDimensions />}
                        description='Espacio que ocupara el almacen medido en metros'
                        background='#E8E1FF'
                        color='#5E3AE6'
                    />
                </div>

                <div className='mainData'>
                    <TextField 
                        value={nuevoAlmacen['Ancho']}
                        incomplete={markAsIncomplete.find(l=>l==='Ancho')}
                        placeholder='Obligatorio'
                        label='Ancho'
                        onChange={(value)=>{
                            if (validateApi.positiveReal(value) && validateApi.measureTruncated(value)) {
                                setNuevoAlmacen({
                                    ...nuevoAlmacen,
                                    'Ancho': value
                                })
                            }
                        }}
                    />
                </div>

                <div className='mainData'>
                    <TextField
                        value={nuevoAlmacen['Alto']}
                        incomplete={markAsIncomplete.find(l=>l==='Alto')}
                        placeholder='Obligatorio'
                        label='Alto'
                        onChange={(value)=>{
                            if (validateApi.positiveReal(value) && validateApi.measureTruncated(value)) {
                                setNuevoAlmacen({
                                    ...nuevoAlmacen,
                                    'Alto': value
                                })
                            }
                        }}
                    />
                </div>

                <div className='mainData'>
                    <TextField 
                        value={nuevoAlmacen['Longitud']}
                        incomplete={markAsIncomplete.find(l=>l==='Longitud')}
                        placeholder='Obligatorio'
                        label='Longitud'
                        onChange={(value)=>{
                            if (validateApi.positiveReal(value) && validateApi.measureTruncated(value)) {
                                setNuevoAlmacen({
                                    ...nuevoAlmacen,
                                    'Longitud': value
                                })
                            }
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