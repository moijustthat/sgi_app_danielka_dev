import axiosClient from '../../../../axios-client'

export const getAlmacenes = async (setLoading, setAlmacenes/** Trabajar en un filtro para recuperar solamente ciertos almacenes(si aporta en algo) */) => {
  setLoading(true)
  axiosClient.get('/almacenes')
    .then(({data})=>{
      const almacenes = data.almacenes
      setAlmacenes(almacenes)
      setLoading(false)
    })
    .catch(error=>{
      const messageError = error.response.data
      console.log(messageError);
      setLoading(false)
    })
}

export const getEntradas = async (setLoading, setEntradas/** Trabajar en un filtro para recuperar solamente ciertos almacenes(si aporta en algo) */) => {
  setLoading(true)
  axiosClient.get('/entradas')
    .then(({data})=>{
      const entradas = data.entradas
      setEntradas(entradas)
      setLoading(false)
    })
    .catch(error=>{
      const messageError = error.response.data
      console.log(messageError);
      setLoading(false)
    })
}

export const getAllItems = async (setLoading, setCategorias, setMarcas, setUnidadesMedida, setAlmacenes) => {
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
      setAlmacenes(data.almacenes.map((almacen, index)=> {
        return {
          label: almacen.nombre,
          value: almacen.almacenId
        }
      }))
      setLoading(false)
    })
    .catch((e) => {
      console.log('Error en la respuesta: '+e);
      setLoading(false)
    }) 
}

export const getProductos = async (setLoading, setProductos) => {
  setLoading(true)
  axiosClient.get('/productos')
  .then(({data}) => {
      const productos = data.data
      setProductos(productos.map((producto, index)=> {
        return {
          label: producto['Nombre'],
          value: producto.id,
          info: producto
        }
      }))
      setLoading(false)
  })
  .catch(error=> {
      const messageErr = error.response.data.messageError
      setLoading(false)
  })  

}