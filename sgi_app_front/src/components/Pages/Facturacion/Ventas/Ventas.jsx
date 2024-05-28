import {useState, useEffect} from 'react'
import './Ventas.css'
import Table from '../../../Common/Table/Table'
import RightDrawer from '../../../Common/RightDrawer/RightDrawer'
import { UilInvoice } from '@iconscout/react-unicons'
import CreateInvoice from './CreateInvoice'
import CircularProgress from '../../../Common/CircularProgess/CircularProgress'
import axiosClient from '../../../../axios-client'
import CardView from '../../../Common/CardViews/CardView'



const Ventas = () => {

    const [loading, setLoading] = useState(false)
    const [openForm, setFormOpen] = useState(false)
    
    // Datos a pedir a la bd
    const [clientes, setClientes] = useState([])
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

    const getClientes = () => {
        setLoading(true)
        axiosClient.get('/clientes')
            .then(({data}) => {
                const response = data.data
                const formatedClientes = []
                for (let cliente of response) {
                    formatedClientes.push({label: cliente['Nombre']+' '+cliente['Apellido'], value: cliente['id'], info:cliente})
                }
                setClientes(formatedClientes)
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
        getClientes()
        getProductos()
        getItems()
    }, [])

    if(loading) return <CircularProgress />

    return (
        <>
            <div className='ListaVentas'>

                <RightDrawer 
                    width={'100vw'} 
                    content={
                    <CreateInvoice 
                        setOpen={setFormOpen}
                        clientes={clientes}
                        productos={productos}
                        categorias={categorias}
                        marcas={marcas}
                        unidades_medida={unidades_medida}
                        />
                    }  
                    open={openForm}/>
                <div className='ventas'>
                    <Table 
                        pagination={false}
                        rows={[]}
                        empty={<CardView type='shopping' text='Aqui veras las ventas que tus clientes realizan!'   style={{
                            marginLeft: '35%',
                            width: '30%',
                            height: '100%'
                          }}/>}
                        generalActions={generalActions}
                    />
                </div>

            </div>
        </>
    )
}

export default Ventas