import React, { useState, useEffect } from 'react'
import SearchField from '../../../../Common/SearchField/SearchField'
import { Avatar } from '@mui/material'
import './ProductosBD.css'
import logo from '../../../../../imgs/logo.png'
import { IconButton } from '@mui/material'
import hexToDataURL from '../../../../../utils/HexToDataUrl'
import { SelectField } from '../../../../Common/AwesomeFields/AwesomeFields'
import CardView from '../../../../Common/CardView/CardView'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Transaccion from './Transaccion'
import CheckMenu from '../../../../Common/CheckMenu/CheckMenu'
import { BiCategory } from "react-icons/bi";
import { TbBrandBilibili } from "react-icons/tb";
import { TbRulerMeasure } from "react-icons/tb";

const filtersMenuConfig = (items, labelAll) => {
    const checkMenu = [{ label: labelAll, check: true, value: 'all' }]
    for (let item of items) {
        checkMenu.push({ label: item.label, check: false, value: item.value })
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
        selectProducto = () => null,
        setListaDetalles = () => null
    } = props
    const [searchNombre, setSearchNombre] = useState('')
    const [searchCodigoBarra, setSearchCodigoBarra] = useState('')
    const [categoriaMenu, setCategoriaMenu] = useState(filtersMenuConfig(categorias, 'Todas las categorias'))
    const [marcaMenu, setMarcaMenu] = useState(filtersMenuConfig(marcas, 'Todas las marcas'))
    const [medidaMenu, setMedidaMenu] = useState(filtersMenuConfig(unidades_medida, 'Todas las unidades de medida'))
    const [carrito, setCarrito] = useState(listaDetalles.reduce((a, b) => Number(a) + Number(b['Cantidad']), 0))
    const [transaccion, setTransaccion] = useState(null)
    const [lista, setLista] = useState(listaDetalles)

    let mainContent = null

    if (productos.length === 0) return <h1>No tienes productos</h1>

    const productosFiltrados = (
        productos
            .map(({ info }) => {
                const detalle = lista.find(detalle => detalle.id === info.id)
                return (<CardView
                    name={info['Nombre']}
                    description={info['Codigo de barra']}
                    img={info['Imagen']}
                    detail1='Precio al publico'
                    value1={'C$' + info['Precio de venta']}
                    detail2='Disponible'
                    value2={info['Disponible']}
                    detail3={<ShoppingCartOutlinedIcon />}
                    value3={detalle ? detalle['Cantidad'] : '0'}
                    btnText='Ver'
                    onBtnClick={() => setTransaccion(info)}
                />)
            })
    )

    const carritoContent = <div className='containerCategory'>
        <div className="headerCategory">
            <div className="fieldContainer">
                <div className="searchContainer">
                    <label>Nombre*</label>
                    <SearchField setSearchText={setSearchNombre} />
                </div>
            </div>
            <div className="fieldContainer">
                <div className="searchContainer">
                    <label>Codigo de barra*</label>
                    <SearchField setSearchText={setSearchCodigoBarra} />
                </div>
            </div>
            <div className="selectContainer">
                <CheckMenu
                    icon={<BiCategory />}
                    columns={categoriaMenu}
                    setColumns={setCategoriaMenu}
                />
            </div>
            <div className="selectContainer">
                <CheckMenu
                    icon={<TbBrandBilibili />}
                    columns={marcaMenu}
                    setColumns={setMarcaMenu}
                />
            </div>
            <div className="selectContainer">
                <CheckMenu
                    icon={<TbRulerMeasure />}
                    columns={medidaMenu}
                    setColumns={setMedidaMenu}
                />
            </div>
            <div className="selectContainer">
                <ShoppingCartOutlinedIcon />
                <label>{carrito}</label>
            </div>
        </div>

        <div className='contentWrapper'>
            <div className='galleryCategory'>
                {productosFiltrados.length > 0 ? productosFiltrados : <h1>No hay productos con los filtros proporcionados</h1>}
            </div>
        </div>
    </div>

    if (transaccion) {
        const marca = marcas.find(marca => marca.value === transaccion['Marca']).label
        const categoria = categorias.find(categoria => categoria.value === transaccion['Categoria']).label
        const medida = unidades_medida.find(medida => medida.value === transaccion['Unidad de medida']).label
        const current = listaDetalles.find(detalle => detalle.id === transaccion.id)
        mainContent = <Transaccion
            producto={transaccion}
            current={current}
            marca={marca}
            categoria={categoria}
            medida={medida}
            onAddCarrito={(amount, detalle) => {
                const producto = transaccion
                const newDetalle = {
                    'Nombre': producto['Nombre'],
                    'Imagen': producto['Imagen'] ? producto['Imagen'] : logo,
                    ...detalle
                }
                setCarrito(carrito + amount)
                setListaDetalles(prev => ([newDetalle, ...prev]))
                setLista(prev => ([newDetalle, ...prev]))
                setTransaccion(null)
            }}
            onClose={() => setTransaccion(null)}
        />
    } else {
        mainContent = carritoContent
    }

    return mainContent
}

export default ProductosBD