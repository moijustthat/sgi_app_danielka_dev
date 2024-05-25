import {useState} from 'react'
import './CreateInvoice.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Divider } from '@mui/material';
import { UilStore } from '@iconscout/react-unicons'
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { FiTool } from "react-icons/fi";
import {TextField, TextArea, SelectField, ImgField, DateField} from '../../../Common/AwesomeFields/AwesomeFields'
import TablaNuevaOrden from '../../../Common/Table/Table'
// producto
import CardView from '../../../Common/CardViews/CardView';
import '../../../Common/Styles/buttons.css'

import FormDialog from '../../../Common/FormDialog/FormDialog'
import ProductosBD from './Categorias/ProductosBD' 

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
    Telefono: '',
    Direccion: ''
}

const initOrden = {
    'Fecha de pago limite': '',
    'Porcentaje de mora': '',
    'Fecha de entrega': '',
    Estado: 'pendiente',
}

const initNewDetalle = {
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
    Imagen: '',
    Cantidad: '',
    'Precio de compra': '',
    'Cantidad con descuento': '',
    'Porcentaje de descuento': ''
}

const [listFullSize, setListFullSize] = useState(false)
const [proveedor, setProveedor] = useState(initProveedor)
const [orden, setOrden] = useState(initOrden)
const [nuevoDetalle, setNuevoDetalle] = useState(initNewDetalle)
const [listaDetalles, setListaDetalles] = useState([])
const [edit, setEdit] = useState(null)
const [requestBd, setRequestBd] = useState(null)


return <>
    <div className='container'>

        <FormDialog 
            fullScreen={true}
            open={requestBd}
            setOpen={(close) => {
                setRequestBd(close)
                setNuevoDetalle({
                    ...nuevoDetalle,
                    id: 'new'
                })
            }}
            title='Productos en la base de datos'
            content={requestBd ? requestBd : ''}
        />

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
                                value={proveedor['Razon social']}
                                label='Razon social'
                                onChange={(value, setErr) => {
                                    setProveedor({
                                        ...proveedor,
                                        'Razon social': value
                                    })
                                }}
                            />

                            <TextField 
                                value={proveedor['Numero RUT']}
                                label='Numero RUT'
                                onChange={(value, setErr) => {
                                    setProveedor({
                                        ...proveedor,
                                        'Numero RUT': value
                                    })
                                }}
                            />
                       </div>

                       <div className='secondaryData'>
                            <TextField 
                                value={proveedor['Correo']}
                                label='Correo'
                                onChange={(value, setErr) => {
                                    setProveedor({
                                        ...proveedor,
                                        'Correo': value
                                    })
                                }}
                            />
                            <TextField 
                                value={proveedor['Telefono']}
                                label='Telefono'
                                onChange={(value, setErr) => {
                                    setProveedor({
                                        ...proveedor,
                                        'Telefono': value
                                    })
                                }}
                            />
                       </div>

                       <div className='mainData'>
                            <TextArea 
                                value={proveedor['Direccion']}
                                label='Direccion'
                                onChange={(value, setErr) => {
                                    setProveedor({
                                        ...proveedor,
                                        'Direccion': value
                                    })
                                }}
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
                            value={orden['Fecha de pago limite']}
                            onChange={(value, setErr, setWarning) => {
                                setOrden({
                                    ...orden,
                                    'Fecha de pago limite': value
                                })
                            }}
                        />
                        <TextField 
                            label='Porcentaje de mora'
                            value={orden['Porcentaje de mora']}
                            onChange={(value, setErr, setWarning) => {
                                setOrden({
                                    ...orden,
                                    'Porcentaje de mora': value
                                })
                            }}
                        />
                    </div>
                    <div className='secondaryData'>
                        <DateField 
                            label='Fecha de entrega'
                            value={orden['Fecha de entrega']}
                            onChange={(value, setErr, setWarning) => {
                                setOrden({
                                    ...orden,
                                    'Fecha de entrega': value
                                })
                            }}
                        />  
                        <SelectField 
                            label='Estado'
                            value={orden['Estado']}
                            options={[{value: 'pendiente', label: 'Pendiente'}, {value: 'pagada', label: 'Pagada'}, {value: 'cancelada', label: 'Cancelada'}]}
                            onChange={(value, setErr, setWarning) => {
                                setOrden({
                                    ...orden,
                                    'Estado': value
                                })
                            }}
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
                        value={nuevoDetalle.id}
                        label='Producto'
                        options={[{value: 'new', label: 'Nuevo producto'}, {value: 'bd', label: 'Buscar en la base de datos'}]}
                        onChange={(value, setErr) => {
                            setNuevoDetalle({
                                ...nuevoDetalle,
                                id: value
                            })
                            if (value === 'bd') {
                                setRequestBd(<ProductosBD productos={productos} categorias={categorias} marcas={marcas} unidades_medida={unidades_medida}/>)
                            }
                            else {
                                setRequestBd(null)
                            }
                        }}
                    />
                </div>
                <div className='secondaryData'>
                        <TextField 
                            label='Cantidad'
                            value={nuevoDetalle.Cantidad}
                            onChange={(value, setErr, setWarning)=>{
                                setNuevoDetalle({
                                    ...nuevoDetalle,
                                    Cantidad: value
                                })
                            }}
                        />
                        <TextField 
                            label='Precio de compra'
                            value={nuevoDetalle['Precio de compra']}
                            onChange={(value, setErr, setWarning)=>{
                                setNuevoDetalle({
                                    ...nuevoDetalle,
                                    ['Precio de compra']: value
                                })
                            }}
                        />
                </div>
                <div className='secondaryData'>
                        <TextField 
                            label='Aplicar descuento a'
                            value={nuevoDetalle['Cantidad con descuento']}
                            onChange={(value, setErr, setWarning)=>{
                                setNuevoDetalle({
                                    ...nuevoDetalle,
                                    ['Cantidad con descuento']: value
                                })
                            }}
                        />
                        <TextField 
                            label='Porcentaje de descuento'
                            value={nuevoDetalle['Porcentaje de descuento']}
                            onChange={(value, setErr, setWarning)=>{
                                setNuevoDetalle({
                                    ...nuevoDetalle,
                                    ['Porcentaje de descuento']: value
                                })
                            }}
                        />
                </div>
                <div style={{display: nuevoDetalle.id === 'new' ? '' : 'none'}}>
                    <div className='secondaryData'>
                        <TextField 
                            label='Nombre'
                            value={nuevoDetalle['Nombre']}
                            onChange={(value, setErr, setWarning)=>{
                                setNuevoDetalle({
                                    ...nuevoDetalle,
                                    ['Nombre']: value
                                })
                            }}
                        />
                        
                        <TextField 
                            label='Codigo de barra'
                            value={nuevoDetalle['Codigo de barra']}
                            onChange={(value, setErr, setWarning)=>{
                                setNuevoDetalle({
                                    ...nuevoDetalle,
                                    ['Codigo de barra']: value
                                })
                            }}
                        />
                    </div>
                    <div className='mainData'>
                        <TextArea 
                            label='Descripcion'
                            value={nuevoDetalle['Descripcion']}
                            onChange={(value, setErr, setWarning)=>{
                                setNuevoDetalle({
                                    ...nuevoDetalle,
                                    ['Descripcion']: value
                                })
                            }}
                        />
                    </div>
                    <div className='secondaryData'>
                        <SelectField 
                            label='Categoria'
                            value={nuevoDetalle['Categoria']}
                            onChange={(value, setErr, setWarning)=>{
                                setNuevoDetalle({
                                    ...nuevoDetalle,
                                    ['Categoria']: value
                                })
                            }}
                        />
                        <SelectField 
                            label='Marca'
                            value={nuevoDetalle['Marca']}
                            onChange={(value, setErr, setWarning)=>{
                                setNuevoDetalle({
                                    ...nuevoDetalle,
                                    ['Marca']: value
                                })
                            }}
                        />
                    </div>
                    <div className='secondaryData'>
                        <SelectField 
                            label='Unidad de medida'
                            value={nuevoDetalle['Unidad de medida']}
                            onChange={(value, setErr, setWarning)=>{
                                setNuevoDetalle({
                                    ...nuevoDetalle,
                                    ['Unidad de medida']: value
                                })
                            }}
                        />
                        <SelectField 
                            label='Metodo de inventario'
                            value={nuevoDetalle['Metodo']}
                            onChange={(value, setErr, setWarning)=>{
                                setNuevoDetalle({
                                    ...nuevoDetalle,
                                    ['Metodo']: value
                                })
                            }}
                        />
                    </div>
                    <div className='secondaryData'>
                        <TextField 
                            label='Minimo'
                            value={nuevoDetalle['Minimo']}
                            onChange={(value, setErr, setWarning)=>{
                                setNuevoDetalle({
                                    ...nuevoDetalle,
                                    ['Minimo']: value
                                })
                            }}
                        />
                        <TextField 
                            label='Maximo'
                            value={nuevoDetalle['Maximo']}
                            onChange={(value, setErr, setWarning)=>{
                                setNuevoDetalle({
                                    ...nuevoDetalle,
                                    ['Maximo']: value
                                })
                            }}
                        />
                    </div>
                    <div className='secondaryData'>
                        <SelectField 
                            label='Es un producto con fecha de caducidad?'
                            value={nuevoDetalle['Maximo']}
                            onChange={(value, setErr, setWarning)=>{
                                setNuevoDetalle({
                                    ...nuevoDetalle,
                                    ['Maximo']: value
                                })
                            }}
                        />
                        <ImgField 
                            label='Imagen del producto'
                            value={nuevoDetalle['Imagen']}
                            onChange={(value, setErr, setWarning)=>{
                                setNuevoDetalle({
                                    ...nuevoDetalle,
                                    ['Imagen']: value
                                })
                            }}
                        />
                    </div>
                </div>
                
            </div>

            <div className='ticket'>
                <TablaNuevaOrden 
                    pagination={false}     
                    empty={<CardView type='delivery' loop={true}/>}
                    rows={[]}
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