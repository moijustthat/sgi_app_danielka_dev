import React, { useState, useEffect } from 'react'
import SearchField from '../../../../Common/SearchField/SearchField'
import { Avatar } from '@mui/material'
import './ProductosBD.css'
import logo from '../../../../../imgs/logo.png'
import { IconButton } from '@mui/material'
import hexToDataURL, { hexToBase64 } from '../../../../../utils/HexToDataUrl'
import { SelectField } from '../../../../Common/AwesomeFields/AwesomeFields'
import CardView from '../../../../Common/CardView/CardView'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Transaccion from './Transaccion'
import CheckMenu from '../../../../Common/CheckMenu/CheckMenu'
import { BiCategory } from "react-icons/bi";
import { TbBrandBilibili } from "react-icons/tb";
import { TbRulerMeasure } from "react-icons/tb";
import RightDrawer from '../../../../Common/RightDrawer/RightDrawer'
import { UilBill } from '@iconscout/react-unicons'
import { Button } from '@mui/material'
import CarritoFacturacion from '../../CarritoFacturacion/CarritoFacturacion'
import noproduct from '../../../../../imgs/noproduct.jpg'
import { truncarDecimal } from '../../../../../utils/textValidation'
import { calcularTotal } from '../../../../../utils/BussinesCalcs'
import { formatearNumeroConComas } from '../../../../../utils/textValidation'
import Adder from '../../../../Common/AlertDialog/Adder'
import { addOnList, restOnList, deleteFromList } from '../../Helpers/Aritmethics'

const filtersMenuConfig = (items, labelAll) => {
    const checkMenu = [{ label: labelAll, checked: true, value: 'all' }]
    for (let item of items) {
        checkMenu.push({ label: item.label, checked: false, value: item.value })
    }
    return checkMenu
}

const ProductosBD = (props) => {

    const {
        listaDetalles = [],
        productos = [],
        categorias = [],
        marcas = [],
        unidades_medida = [],
        modelDetalle = {},
        selectProducto = () => null,
        setListaDetalles = () => null,
        setClose = () => null
    } = props
    const [searchNombre, setSearchNombre] = useState('')
    const [searchCodigoBarra, setSearchCodigoBarra] = useState('')
    const [categoriaMenu, setCategoriaMenu] = useState(filtersMenuConfig(categorias, 'Todas las categorias'))
    const [marcaMenu, setMarcaMenu] = useState(filtersMenuConfig(marcas, 'Todas las marcas'))
    const [medidaMenu, setMedidaMenu] = useState(filtersMenuConfig(unidades_medida, 'Todas las unidades de medida'))
    const [lista, setLista] = useState([...listaDetalles])
    const [openFactura, setOpenFactura] = useState(false)

    const subtotal = truncarDecimal(lista.reduce((a, b) => Number(a) + Number(b['Cantidad']) * Number(b['Precio de compra']), 0))
    const total = truncarDecimal(lista.reduce((a, b) => Number(a) + calcularTotal(Number(b['Cantidad']), Number(b['Precio de compra']), Number(b['Cantidad con descuento']), Number(b['Porcentaje de descuento'])), 0))
    const cantidad = truncarDecimal(lista.reduce((a, b) => Number(a) + Number(b['Cantidad']), 0))

    const setBothLists = (callback) => {
        setLista(callback) // Añadir a la lista que se ve en la factura desplegable(con el objetivo de mantener los datos de la factura paralelamente entre las dos vistas)
        setListaDetalles(callback) // Añadir a la lista global
    }

    

    const addItem = (producto) => {
        console.log(producto)
        const newDetalle = {
            id: String(producto.id),
            'Imagen': producto['Imagen'] && producto['Imagen'] !== '' ? hexToBase64(producto['Imagen']) : '',
            'Nombre': producto['Nombre'],
            'Cantidad': 1,
            'Precio de compra': producto['Precio de venta'],
            'Cantidad con descuento': 0,
            'Porcentaje de descuento': 0
        }
        setBothLists(prev => ([newDetalle, ...prev]))
    }


    if (productos.length === 0) return <h1>No tienes productos</h1>

    const productosFiltrados = (
        productos
            .filter(({ info }) => {
                let activeCategorias = categoriaMenu.filter(categoria => categoria.checked)
                let categoriaFilter = activeCategorias.find(categoria => String(categoria.value) === String(info['Categoria']))
                let activeMarcas = marcaMenu.filter(marca => marca.checked)
                let marcaFilter = activeMarcas.find(marca => String(marca.value) === String(info['Marca']))
                let activeMedidas = medidaMenu.filter(medida => medida.checked)
                let medidaFilter = activeMedidas.find(medida => String(medida.value) === String(info['Unidad de medida']))

                if (categoriaMenu.find(categoria => categoria.value === 'all').checked) categoriaFilter = true
                if (marcaMenu.find(marca => marca.value === 'all').checked) marcaFilter = true
                if (medidaMenu.find(medida => medida.value === 'all').checked) medidaFilter = true

                // Filtro de los checkbox
                const checkFilter = categoriaFilter && marcaFilter && medidaFilter
                // Filtro por nombre
                const nameFilter = info['Nombre'].toUpperCase().includes(searchNombre.toUpperCase())
                // FIltro por codigo de barra
                const code = info['Codigo de barra'] ? String(info['Codigo de barra']) : ''
                const codeFilter = code.toUpperCase().includes(searchCodigoBarra.toUpperCase())
                if (checkFilter && nameFilter && codeFilter) return true
                return false
            })
            .map(({ info }) => {
                const detalle = lista.find(detalle => detalle.id === info.id)
                const categoria = categorias.find(m => String(m.value) === String(info['Categoria'])).label
                const marca = marcas.find(m => String(m.value) === String(info['Marca'])).label
                const medida = unidades_medida.find(m => String(m.value) === String(info['Unidad de medida'])).label
                const productoInList = lista.find(d => String(d.id) === String(info.id))
                const cantidad = productoInList ? Number(productoInList['Cantidad']) : 0
                console.log(productoInList)
                return (<CardView
                    name={info['Nombre']}
                    img={info['Imagen']}
                    detail1='Precio al publico'
                    value1={'C$' + info['Precio de venta']}
                    btnText='+ Agregar'
                    onBtnClick={() => addItem(info)}
                    replaceBtn={cantidad > 0 ?
                        <Adder
                            onPlus={() => addOnList(setBothLists, cantidad, 'Cantidad', info.id)}
                            onMinus={() => restOnList(setBothLists, cantidad, 'Cantidad', info.id)}
                            onDelete={() => deleteFromList(setBothLists, cantidad,info.id)}
                            counter={cantidad} />
                        :
                        null}
                />)
            })
    )



    return (<div className='containerCategory'>
        <div className="headerCategory">

            <div className='logoCarrito'>
                <img src={logo} alt='logo' />
                <span>
                    Danielka
                </span>
            </div>

            <div className='filterSection'>
                <div className='menuFields'>
                    <div className='menuField'>
                        <p>Categorias</p>
                        <CheckMenu
                            icon={<BiCategory />}
                            columns={categoriaMenu}
                            setColumns={setCategoriaMenu}
                        />
                    </div>
                    <div className='menuField'>
                        <p>Marcas</p>
                        <CheckMenu
                            icon={<TbBrandBilibili />}
                            columns={marcaMenu}
                            setColumns={setMarcaMenu}
                        />
                    </div>
                    <div className='menuField'>
                        <p>Unidades de medida</p>
                        <CheckMenu
                            icon={<TbRulerMeasure />}
                            columns={medidaMenu}
                            setColumns={setMedidaMenu}
                        />
                    </div>
                </div>
                <div className='searchFields'>
                    <div className='searchField'>
                        <label>Nombre</label>
                        <SearchField height='4vh' setSearchText={setSearchNombre} />
                    </div>
                    <div className='searchField'>
                        <label>Codigo de barra</label>
                        <SearchField height='4vh' setSearchText={setSearchCodigoBarra} />
                    </div>
                </div>

            </div>

            <div className='rightSideFactura'>
                <Button
                    sx={{
                        marginRight: '15px'
                    }}
                    variant='outlined'
                    color='error'
                    onClick={setClose}>
                    Regresar a la factura
                </Button>
                <IconButton onClick={() => setOpenFactura(!!!openFactura)}>
                    <UilBill />
                    <h6>C${formatearNumeroConComas(total)}</h6>
                </IconButton>
            </div>

        </div>
        <RightDrawer
            width={'40vw'}
            open={openFactura}
            content={<CarritoFacturacion
                onClose={() => setOpenFactura(false)}
                listaDetalles={lista}
                setListaDetalles={setBothLists}
                productos={productos}
                subtotal={subtotal}
                total={total}
            />}
        />
        <div className='contentWrapper'>
            <div className='galleryCategory'>

                {productosFiltrados.length > 0 ? productosFiltrados : <h1>No hay productos con los filtros proporcionados</h1>}
            </div>
        </div>
    </div>)
}

export default ProductosBD