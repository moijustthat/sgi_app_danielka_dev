import React, {useState} from 'react'
import SearchField from '../../../../Common/SearchField/SearchField'
import { Avatar } from '@mui/material'
import './ProductosBD.css'
import a from '../../../../../imgs/logo.png'
import {IconButton} from '@mui/material'
import hexToDataURL from '../../../../../utils/HexToDataUrl'
import { SelectField } from '../../../../Common/AwesomeFields/AwesomeFields'
import CardView from '../../../../Common/CardView/CardView'

const ProductosBD = (props) => {
    
    const {
        productos=[],
        categorias=[],
        marcas=[],
        unidades_medida=[]
    } = props
    const [searchNombre, setSearchNombre] = useState('')
    const [searchCodigoBarra, setSearchCodigoBarra] = useState('')   
    const [categoria, setCategoria] = useState('all')
    const [marca, setMarca] = useState('all')
    const [medida, setMedida] = useState('all')



    if (productos.length === 0 ) return <h1>No tienes productos</h1>
    console.log(productos);
    return (
        <div className='containerCategory'>
        <div className="headerCategory">
            <div className="fieldContainer">
                <div className="searchContainer">
                    <label>Nombre*</label>  
                    <SearchField setSearchText={setSearchNombre}/>
                </div>
            </div>
            <div className="fieldContainer">
                <div className="searchContainer">
                    <label>Codigo de barra*</label>  
                    <SearchField setSearchText={setSearchCodigoBarra}/>
                </div>
            </div>
            <div className="selectContainer">
                <SelectField 
                    value={categoria}
                    label='Categorias'
                    options={[{value: 'all', label: 'Todas las categorias'}, ...categorias]}
                    onChange={(value)=> {
                        setCategoria(value)
                    }}
                />
            </div>
            <div className="selectContainer">
                <SelectField 
                    value={marca}
                    label='Marcas'
                    options={[{value: 'all', label: 'Todas las marcas'}, ...marcas]}
                    onChange={(value)=> {
                        setMarca(value)
                    }}
                />
            </div>
            <div className="selectContainer">
                <SelectField 
                    value={medida}
                    label='Medidas'
                    options={[{value: 'all', label: 'Todas las medidas'}, ...unidades_medida]}
                    onChange={(value)=> {
                        setMedida(value)
                    }}
                />
            </div>
        </div>

        <div className='contentWrapper'>
            <div className='galleryCategory'>
                {productos.map(p=> {
                    let item = null
                    const producto = p.info
                    const nombre = producto['Nombre'].toLowerCase()
                    const codBarra = producto['Codigo de barra'] !== '' && producto['Codigo de barra'] ? String(producto['Codigo de barra']) : ''
                    const filtroCategoria = categoria === 'all' ? true : categoria === String(producto['Categoria'])
                    const filtroMarca = marca === 'all' ? true : marca === String(producto['Marca'])
                    const filtroMedida = medida === 'all' ? true : medida === String(producto['Unidad de medida'])
                    const filtroTextual = nombre.includes(searchNombre.toLowerCase()) && codBarra.includes(searchCodigoBarra)
                    console.log(categoria, marca, medida)
                    console.log(filtroCategoria, filtroMarca, filtroMedida)
                   if (filtroTextual && filtroCategoria && filtroMarca && filtroMedida) {
                    item = <CardView 
                    seeMore={false}
                    name={nombre}
                    description={codBarra}
                    img={producto['Imagen']}
                    detail1='Precio al publico'
                    value1={'C$'+ producto['Precio de venta']}
                    detail2='Disponible'
                    value2={producto['Disponible']}
                    detail3='Importe'
                    value3={'C$ '+producto['Total vendido']}
                    />
                   }
                   return item
                })}
                
            </div>
        </div>
    </div>
    )
}

export default ProductosBD