import React, { useState, useEffect } from 'react'
import './FormEdit.css'
import { TextField, TextArea, ImgField, SelectField } from '../../../Common/AwesomeFields/AwesomeFields'
import validateApi from '../../../../utils/textValidation'
import '../../../Common/FormsCss/FormsCss.css'

const FormEdit = (props) => {

    const {
        id,
        setUpdate,
        productos,
        productoEditado,
        seleccionables,
        requestUpdate
    } = props

    const [productoEditable, setProductoEditado] = useState({ ...productoEditado })

    useEffect(() => {
        if (id !== null) {
            const productoEditado = {}

            const producto = productos.find(p => p.id == id)
            productoEditado['Nombre'] = producto['Nombre']
            productoEditado['Descripcion'] = producto['Descripcion']
            productoEditado['Codigo de barra'] = producto['Codigo de barra']
            productoEditado['Precio de venta'] = producto['Precio de venta']
            productoEditado['Categoria'] = producto['Categoria']
            productoEditado['Marca'] = producto['Marca']
            productoEditado['Unidad de medida'] = producto['Unidad de medida']
            productoEditado['Metodo'] = producto['Metodo']
            productoEditado['Minimo'] = producto['Minimo']
            productoEditado['Maximo'] = producto['Maximo']
            productoEditado['Imagen'] = producto['Imagen']

            const productoNombre = producto ? producto['Nombre'] : ''
            const productoImagen = producto ? producto['Imagen'] : null

            setProductoEditado(productoEditado)
        } else {
            setProductoEditado({})
        }
    }, [id])

    const rollbackBeforePost = () => {
        let rollback = false
        // Campos vacios
        let vacios = []
        const campos = Object.keys(productoEditable)
        for (let campo of campos) {
            if (productoEditable[campo] === '' || !!!productoEditable[campo]) vacios.push(campo)
        }

        if (vacios.length > 0) {
            alert(`Campos vacios: ${vacios}`)
            rollback = true
        }

        // Validaciones logicas
        let minimo = Number(productoEditable['Minimo'])
        let maximo = (productoEditable['Maximo'])

        if (minimo > maximo) {
            alert('La cantidad minima no puede ser mayor a la maxima')
            rollback = true
        }

        if (minimo === maximo) {
            alert('Debe existir un margen entre la cantidad minima y maxima')
            rollback = true
        }

        return rollback
    }

    const handleChange = (label, value) => {
        if (label === 'Imagen') {
            if (value === '') {
                setProductoEditado({
                    ...productoEditable,
                    [label]: value
                })
                return
            }
            const file = value // Esta es la  ruta de la imagen
            const reader = new FileReader()

            reader.onloadend = () => {
                setProductoEditado({
                    ...productoEditable,
                    [label]: reader.result.replace("data:", "").replace(/^.+,/, "")
                })
            }

            reader.readAsDataURL(file)

        } else {
            setProductoEditado({
                ...productoEditable,
                [label]: value
            })
        }
    }


    function handleUpdate() {
        const payload = {}
        const keys = Object.keys(productoEditable)

        if (!rollbackBeforePost()) {
            for (let key of keys) {
                if (productoEditable[key] !== null && productoEditable[key] !== '') {
                    payload[key] = productoEditable[key]
                }
            }
            requestUpdate(id, payload)
            setUpdate(null)
            // En lugar de recargar la pagina, actualizar directamente en el frontend
        }
    }




    return (

        <div className='containerRight'>
            <div className='formCarritoRight'>
                <div className='mainData'>
                    <TextField
                        value={productoEditable['Nombre']}
                        label='Nombre'
                        onChange={(value, setErr) => {
                            if (validateApi.everything(value)) {
                                handleChange('Nombre', value)
                                setErr('')
                            } else {
                                setErr('Entrada no valida')
                            }
                        }}
                    />
                </div>

                <div className='mainData'>
                    <TextArea
                        value={productoEditable['Descripcion']}
                        label='Descripcion'
                        onChange={(value, setErr) => {
                            if (validateApi.everything(value)) {
                                handleChange('Descripcion', value)
                                setErr('')
                            } else {
                                setErr('Entrada no valida')
                            }
                        }}
                    />
                </div>

                <div className='secondaryData'>
                    <TextField
                        value={productoEditable['Codigo de barra']}
                        label='Codigo de barra'
                        onChange={(value, setErr) => {
                            if (validateApi.numeric(value)) {
                                handleChange('Codigo de barra', value)
                                setErr('')
                            } else {
                                setErr('Solo se permiten digitos')
                            }
                        }}
                    />
                    <TextField
                        value={productoEditable['Precio de venta']}
                        label='Precio de venta'
                        onChange={(value, setErr) => {
                            if (validateApi.positiveReal(value)) {
                                handleChange('Precio de venta', value)
                                setErr('')
                            } else {
                                setErr('Ingresa un precio valido')
                            }
                        }}
                    />
                </div>

                <div className='secondaryData'>
                    <SelectField
                        value={productoEditable['Categoria']}
                        label='Categoria'
                        options={seleccionables.categorias}
                        onChange={(value, setErr) => {
                            handleChange('Categoria', value)
                        }}
                    />
                    <SelectField
                        value={productoEditable['Marca']}
                        label='Marca'
                        options={seleccionables.marcas}
                        onChange={(value, setErr) => {
                            handleChange('Marca', value)
                        }}
                    />
                </div>

                <div className='secondaryData'>
                    <SelectField
                        value={productoEditable['Unidad de medida']}
                        label='Unidad de medida'
                        options={seleccionables.unidades_medida}
                        onChange={(value, setErr) => {
                            handleChange('Unidad de medida', value)
                        }}
                    />
                    <SelectField
                        value={productoEditable['Metodo']}
                        label='Metodo de inventario'
                        options={seleccionables.metodos}
                        onChange={(value, setErr) => {
                            handleChange('Metodo', value)
                        }}
                    />
                </div>

                <div className='secondaryData'>
                    <TextField
                        value={productoEditable['Minimo']}
                        label='Minimo'
                        onChange={(value, setErr) => {

                            if (validateApi.number(value)) {
                                handleChange('Minimo', value)
                                setErr('')
                            } else {
                                setErr('Entrada no valida')
                            }
                        }}
                    />
                    <TextField
                        value={productoEditable['Maximo']}
                        label='Maximo'
                        onChange={(value, setErr) => {

                            if (validateApi.number(value)) {
                                handleChange('Maximo', value)
                                setErr('')
                            } else {
                                setErr('Entrada no valida')
                            }
                        }}
                    />
                </div>

                <div className='mainData'>
                    <ImgField
                        value={productoEditable['Imagen']}
                        label='Imagen del producto'
                        onChange={(value, setErr) => {
                            handleChange('Imagen', value)
                        }}
                    />
                </div>
            </div>

            <button className='btnAgregarRight vw40' onClick={handleUpdate}>Actualizar</button>


        </div>
    )
}

export default FormEdit