import {useState, useEffect} from 'react'
import Banner from '../../../Common/Banner/Banner'
import './Ordenes.css'
import Table from '../../../Common/Table/Table'
import RightDrawer from '../../../Common/RightDrawer/RightDrawer'
import { UilInvoice } from '@iconscout/react-unicons'
import CreateInvoice from './CreateInvoice'
import CircularProgress from '../../../Common/CircularProgess/CircularProgress'
import axiosClient from '../../../../axios-client'

const Ordenes = () => {

    const [loading, setLoading] = useState(false)
    const [openForm, setFormOpen] = useState(false)
    
    // Datos a pedir a la bd
    const [proveedores, setProveedores] = useState([])
    const [productos, setProductos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [marcas, setMarcas] = useState([])
    const [unidades_medida, setUnidadesMedida] = useState([])

    const generalActions = [
        {
            icon: <UilInvoice />,
            label: 'Nueva Orden',
            condition: () => true,
            action: () => setFormOpen(true)
        }
    ]

    const getProveedores = () => {
        setLoading(true)
        axiosClient.get('/proveedores')
            .then(({data}) => {
                const response = data.data
                const formatedProveedores = []
                for (let proveedor of response) {
                    formatedProveedores.push({label: proveedor['Razon Social'], value: proveedor['id'], info:proveedor})
                }
                setProveedores(formatedProveedores)
                setLoading(false)
            })
            .catch(error=> {
                console.log(error)
                setLoading(false)
            })
    }

    const getProductos = () => {
        setLoading(true)
        axiosClient.get('/productos')
            .then(({data}) => {
                const response = data.data
                const formatedProductos = []
                for (let producto of response) {
                    formatedProductos.push({label: producto['Nombre'], value: producto['id'], info:producto})
                }
                setProductos(formatedProductos)
                setLoading(false)
            })
            .catch(error=> {
                console.log(error)
                setLoading(false)
            })
    }

    const getItems = async () => {
        setLoading(true)
        axiosClient.get('/seleccionables')
          .then(({data}) => {
            setCategorias(data.categorias.map((categoria, index)=> {
              return {
                label: categoria.nombre,
                value: categoria.categoriaId
              }
            }))
            setMarcas(data.marcas.map((marca,index)=> {
              return {
                label: marca.nombre,
                value: marca.marcaId
              }
            }))
            setUnidadesMedida(data.unidades_medida.map((medida, index)=> {
              return {
                label: medida.nombre,
                value: medida.unidadMedidaId
              }
            }))
            setLoading(false)
          })
          .catch((e) => {
            console.log('Error en la respuesta: '+e);
            setLoading(false)
          }) 
      }

    useEffect(()=>{
        getProveedores()
        getProductos()
        getItems()
    }, [])

    if(loading) return <CircularProgress />
    


    return (
        <>
            <div className='ListaOrdenes'>

                <RightDrawer 
                    width={'100vw'} 
                    content={
                    <CreateInvoice 
                        setOpen={setFormOpen}
                        proveedores={proveedores}
                        productos={productos}
                        categorias={categorias}
                        marcas={marcas}
                        unidades_medida={unidades_medida}
                        />
                    }  
                    open={openForm}/>
                <div className='ordenes'>
                    <Table 
                        pagination={false}
                        rows={[]}
                        generalActions={generalActions}
                    />
                </div>

            </div>
        </>
    )
}

export default Ordenes