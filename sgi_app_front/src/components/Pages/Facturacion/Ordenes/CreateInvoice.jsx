import {useState} from 'react'
import './CreateInvoice.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Divider } from '@mui/material';
import { UilStore } from '@iconscout/react-unicons'
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { FiTool } from "react-icons/fi";
import {TextField, TextArea, SelectField, ImgField, DateField} from '../../../Common/AwesomeFields/AwesomeFields'
import TablaNuevaOrden from '../../../Common/Table/Table'

const CreateInvoice = (props) => {
const {
    setOpen,
    proveedores,
    productos,
    categorias,
    marcas,
    unidades_medida
} = props

const initProveedor = {
    id: 'new',
    'Razon social': '',
    'Numero RUT': '',
    Correo: '',
    Direccion: ''
}

const initProducto = {
    id: 'new',
    Nombre: '',
    'Codigo de barra': '',
    Precio: '',
    Descripcion: '',
    Categoria: categorias.length > 0 ? categorias[0].value : 'empty',
    Marca: marcas.length > 0 ? marcas[0].value : 'empty',
    'Unidad de medida': unidades_medida.length > 0 ? unidades_medida[0].value : 'empty',
    Metodo: 'peps',
    Minimo: '',
    Maximo: '',
    Caducidad: 'f',
    Imagen: ''
}

const [listFullSize, setListFullSize] = useState(false)
const [proveedor, setProveedor] = useState(initProveedor)
const [producto, setProducto] = useState(initProducto)
const [edit, setEdit] = useState(null)

return <>
    <div className='container'>
        <div className={`glass ${listFullSize ? 'fullGlass' : 'partialGlass'}`}>
            <div className='exit'>
                <IconButton  onClick={() => setOpen(false)}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            
            <div className='formCarrito'>
                <div>            
                    <div className='mainData'>
                        <div className='TitleContainer'>
                        <div className='Title'>
                            <h3>Proveedor de la orden</h3>
                            <span style={{
                            background: '#E8E1FF',
                            color: '#5E3AE6',
                            }}><UilStore /></span>
                        </div>
                        <p>*Ingrese la informacion del proveedor al que pedira la orden</p>
                        </div>
                    </div>
                </div>

                <div className='mainData'>
                    <Divider />
                </div>

                {/* Datos del proveedor*/}
                <div>
                    <div className='mainData'>
                        <SelectField 
                            value={proveedor.id}
                            label='Proveedor*'
                            options={[{value: 'new', label: 'Nuevo proveedor'}, ...proveedores]}
                            onChange={(value) => {
                                setProveedor({
                                    ...proveedor,
                                    id: value
                                })
                            }}
                        />
                    </div>
                    <div style={{display: proveedor.id === 'new' ? '' : 'none'}}>
                       <div className='secondaryData'>
                            <TextField 
                                label='Razon social'
                            />

                            <TextField 
                                label='Numero RUT'
                            />
                       </div>

                       <div className='secondaryData'>
                            <TextField 
                                label='Correo'
                            />

                            <TextField 
                                label='Direccion'
                            />
                       </div>
                    </div>
                </div>


                <div>            
                    <div className='mainData'>
                        <div className='TitleContainer'>
                        <div className='Title'>
                            <h3>Datos generales de la orden</h3>
                            <span style={{
                            background: '#D8FFF5',
                            color: '#21A97F',
                            }}><LiaFileInvoiceSolid /></span>
                        </div>
                        <p>*Ingrese la informacion necesaria para crear la orden</p>
                        </div>
                    </div>
                </div>

                <div className='mainData'>
                    <Divider />
                </div>

                {/* Datos de la orden */}
                <div>
                    <div className='secondaryData'>
                        <DateField 
                            label='Fecha de pago limite'
                        />
                        <TextField 
                            label='Porcentaje de mora'
                        />
                        <SelectField 
                            label='Estado'
                        />
                    </div>
                </div>
                
                <div>            
                    <div className='mainData'>
                        <div className='TitleContainer'>
                        <div className='Title'>
                            <h3>Item</h3>
                            <span style={{
                            background: '#FFF9D0',
                            color: '#EED243',
                            }}><FiTool /></span>
                        </div>
                        <p>*Nuevo item</p>
                        </div>
                    </div>
                </div>

                <div className='mainData'>
                    <Divider />
                </div>

                {/* Datos del item */}

                {/* Datos del produco*/}
                <div className='mainData'>
                    <SelectField 
                        value={producto.id}
                        label='Producto'
                        options={[{value: 'new', label: 'Nuevo producto'}, ...productos]}
                        onChange={(value, setErr) => {
                            setProducto({
                                ...producto,
                                id: value
                            })
                        }}
                    />
                </div>
                <div style={{display: producto.id === 'new' ? '' : 'none'}}>
                    <div className='secondaryData'>
                        <TextField 
                            label='Nombre'
                        />
                        <TextField 
                            label='Codigo de barra'
                        />
                        <TextField 
                            label='Precio'
                        />
                    </div>
                    <div className='mainData'>
                        <TextArea 
                            label='Descripcion'
                        />
                    </div>
                    <div className='secondaryData'>
                        <SelectField 
                            label='Categoria'
                        />
                        <SelectField 
                            label='Marca'
                        />
                    </div>
                    <div className='secondaryData'>
                        <SelectField 
                            label='Unidad de medida'
                        />
                        <SelectField 
                            label='Metodo de inventario'
                        />
                    </div>
                    <div className='secondaryData'>
                        <TextField 
                            label='Minimo'
                        />
                        <TextField 
                            label='Maximo'
                        />
                    </div>
                    <div className='secondaryData'>
                        <SelectField 
                            label='Es un producto con fecha de caducidad?'
                        />
                        <ImgField 
                            label='Imagen del producto'
                        />
                    </div>
                </div>
                
            </div>

            <div className='ticket'>
                <TablaNuevaOrden 
                    pagination={false}      
                />
            </div>

            <button style={{display: edit ? 'none' : ''}} className={`btnAgregarItem ${!listFullSize ? 'partialBtn' : 'noneBtn'}`}>Agregar a la factura</button>
            <div style={{display: !edit ? 'none' : ''}} className='editBtns'>
                <button>Actualizar</button>
                <button>Cancelar</button>
            </div>
            <button  className={`btnAgregarOrden ${!listFullSize ? 'partialBtn' : 'fullBtn'}`}>Realizar orden</button>
        </div>
    </div>
</>
}

export default CreateInvoice