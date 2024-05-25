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
        productos=[]
    } = props
    const [searchNombre, setSearchNombre] = useState('')
    const [searchCodigoBarra, setSearchCodigoBarra] = useState('')   


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
                <SelectField label='Categorias'/>
            </div>
            <div className="selectContainer">
                <SelectField label='Marcas'/>
            </div>
            <div className="selectContainer">
                <SelectField label='Medidas'/>
            </div>
        </div>

        <div className='contentWrapper'>
            <div className='galleryCategory'>
                {productos.map(p=> {
                    let item = null
                    const producto = p.info
                    const nombre = producto['Nombre'].toLowerCase()
                    const codBarra = producto['Codigo de barra'] !== '' && producto['Codigo de barra'] ? String(producto['Codigo de barra']) : ''
                   if (nombre.includes(searchNombre.toLowerCase()) && codBarra.includes(searchCodigoBarra)) {
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