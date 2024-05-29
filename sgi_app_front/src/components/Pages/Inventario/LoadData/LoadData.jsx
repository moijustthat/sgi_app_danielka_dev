import axiosClient from '../../../../axios-client'

export const getItems = async (setLoading, setData, item) => {
    setLoading(true)
    axiosClient.get('/seleccionables')
      .then(({data}) => {
        switch(item) {
          case 'categorias':
            setData(data.categorias.map((categoria, index)=> {
              return {
                label: categoria.nombre,
                value: categoria.categoriaId
              }
            }))
            break;
          case 'marcas':
            setData(data.marcas.map((marca,index)=> {
              return {
                label: marca.nombre,
                value: marca.marcaId
              }
            }))
            break;
          case 'medidas':
            setData(data.unidades_medida.map((medida, index)=> {
              return {
                label: medida.nombre,
                value: medida.unidadMedidaId
              }
            }))
            break;
          case 'almacenes':
            setData(data.almacenes.map((almacen, index)=> {
              return {
                label: almacen.nombre,
                value: almacen.almacenId
              }
            }))  
          break;
        }
        setLoading(false)
      })
      .catch((e) => {
        console.log('Error en la respuesta: '+e);
        setLoading(false)
      }) 
}

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