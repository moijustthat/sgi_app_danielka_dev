import React, { useState } from 'react'
import { TextField, SelectField, DateField } from '../../../Common/AwesomeFields/AwesomeFields'
import Title from '../../../Common/Title/Title'
import { Divider, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../../Common/FormsCss/FormsCss.css'
import validateApi from '../../../../utils/textValidation';
import axiosClient from '../../../../axios-client';
import { UilBox } from '@iconscout/react-unicons'
import { handleConditionalCostValidation } from '../../../../utils/Searching'
import * as DateHandler from '../../../../utils/DatesHelper'

const init = {
    'Producto': 'empty',
    'Almacen': 'empty',
    'Cantidad': '',
    'Comprobante': '',//'empty', pensar si implementar esto
    'Fecha de vencimiento': ''
}

const AddEntrada = React.memo((props) => {

    const {
        setOpen = () => null,
        productos = [],
        almacenes = [],
        detalles = [],
        categorias=[],
        marcas=[],
        unidades_medida=[]
    } = props

    const [nuevoStock, setNuevoStock] = useState(init)
    const [categoria, setCategoria] = useState('all')
    const [marca, setMarca] = useState('all')
    const [unidad_medida, setUnidadMedida] = useState('all')
    const [markAsIncomplete, setMarkAsIncomplete] = useState([])

    const hasCaducate = (id) => {
        if (id==='empty') return false
        else return productos.find(producto=>String(producto.value)===String(id)).info['Caducidad'] === 't'
    }
    
    const filterProductos = (productos) => {
        const filtered =  productos.filter(({info})=>(
            (categoria === 'all' || String(info['Categoria']) === categoria) &&
            (marca === 'all' || String(info['Marca']) === marca) && 
            (unidad_medida === 'all' || String(info['Unidad de medida']) === unidad_medida)
        ))
        console.log(filtered)
        return filtered
    }

    const onRegistrar = () => {
        let cancel = false
        const required = ['Producto', 'Almacen', 'Cantidad']
        const empty = []
        if (hasCaducate(nuevoStock['Producto'])) required.push('Fecha de vencimiento')

        for (let require of required) {
            if (!nuevoStock[require] || nuevoStock[require] === '' || nuevoStock[require] === 'empty') {
                empty.push(require)
            }
        }

        setMarkAsIncomplete(empty)

        if (empty.length > 0) cancel = true 
    
        if(cancel) return
        else {
            axiosClient.post('/entrada', {'entrada': nuevoStock})
                .then(({data})=>{
                    console.log(data)
                })
                .catch(error=>{
                    console.log(error)
                })
        }
    }

    return (
        <div className='containerRight'>
            <div className='formCarritoRight'>
                <div>
                    <IconButton onClick={() => setOpen(false)}>
                        <ArrowBackIcon />
                    </IconButton>

                    <div className='mainData'>
                        <Title
                            title='Nuevo Stock'
                            icon={<UilBox />}
                            description='Actualizar el inventario agregando un nuevo stock'
                            background='#E0F3FE'
                            color='#AA6068'
                        />
                    </div>

                    <div className='mainData'>
                        <Divider />
                    </div>

                    <div className='filtroProductos'>
                        <div className='secondaryData'>
                            <SelectField 
                                value={categoria}
                                label='Categorias'
                                options={[{value: 'all', label:'Todas las categorias'}, ...categorias]}
                                onChange={(value)=>setCategoria(value)}
                            />
                            <SelectField 
                                value={marca}
                                label='Marcas'
                                options={[{value: 'all', label:'Todas las marcas'}, ...marcas]}
                                onChange={(value)=>setMarca(value)}
                            />
                        </div>
                        <div className='secondaryData'>
                            <SelectField 
                                value={unidad_medida}
                                label='Unidades de medida'
                                options={[{value: 'all', label:'Todas las medidas'}, ...unidades_medida]}
                                onChange={(value)=>setUnidadMedida(value)}
                            />
                            <SelectField 
                                incomplete={markAsIncomplete.find(l=>l==='Producto')}
                                value={nuevoStock['Producto']}
                                label='Productos'
                                options={function (){
                                    const filtered = filterProductos(productos)
                                    return [{value:'empty', label:filtered.length < 1 ? 'Producto no encontrados' : 'Seleccionar producto'}, ...filtered]
                                }()}
                                onChange={(value)=>{
                                    setNuevoStock({
                                        ...nuevoStock,
                                        'Producto' : value
                                    })
                                }}
                            />
                        </div>
                    </div>
                    
                    <div style={{display: hasCaducate(nuevoStock['Producto']) ? '' : 'none'}} className='mainData'>
                        <DateField 
                                incomplete={markAsIncomplete.find(l=>l==='Fecha de vencimiento')}
                                value={nuevoStock['Fecha de vencimiento']}
                                label='Fecha de vencimiento'
                                onChange={(value, setErr, setWarning)=>{
                                    handleConditionalCostValidation(value, (date) => DateHandler.isLesserOrEqual(date, DateHandler.getCurrentDate()),
                                     ()=> {
                                          setWarning('Fecha de vencimiento invalida')
                                          setNuevoStock({
                                            ...nuevoStock,
                                            'Fecha de vencimiento': ''
                                          })
                                          return true
                                        },
                                    ()=>{
                                          setWarning('')
                                          setNuevoStock({
                                            ...nuevoStock,
                                            'Fecha de vencimiento': value
                                          })
                                          return false
                                        }
                                    )
                                }
                            }
                        />
                    </div>

                    <div className='mainData'>
                        <SelectField 
                                incomplete={markAsIncomplete.find(l=>l==='Almacen')}
                                value={nuevoStock['Almacen']}
                                label='Almacenes'
                                options={[{value: 'empty', label:'Seleccionar almacen'}, ...almacenes]}
                                onChange={(value)=>{
                                    setNuevoStock({
                                        ...nuevoStock,
                                        'Almacen': value
                                    })
                                }}
                        />
                    </div>

                    <div className='mainData'>
                        <TextField
                            incomplete={markAsIncomplete.find(l=>l==='Cantidad')}
                            value={nuevoStock['Cantidad']}
                            label='Cantidad'
                            onChange={(value, setErr, setWarning) => {
                                if (validateApi.number(value)) {
                                    setNuevoStock({
                                        ...nuevoStock,
                                        'Cantidad': value
                                    })
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            <button 
                onClick={onRegistrar}
                className='btnAgregarRight'>
               Agregar nuevo stock
            </button>
        </div>
    )
})

export default AddEntrada