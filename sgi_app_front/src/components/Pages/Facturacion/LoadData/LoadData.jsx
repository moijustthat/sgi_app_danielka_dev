import axiosClient from "../../../../axios-client"

export const getOrdenes = async (setLoading, setOrdenes/** Trabajar en un filtro para recuperar solamente ciertos almacenes(si aporta en algo) */) => {
  setLoading(true)
  axiosClient.get('/ordenes')
    .then(({ data }) => {
      const ordenes = data.ordenes
      setOrdenes(ordenes)
      setLoading(false)
    })
    .catch(error => {
      const messageError = error.response.data
      console.log(messageError);
      setLoading(false)
    })
}

export const getVentas = async (setLoading, setVentas/** Trabajar en un filtro para recuperar solamente ciertos almacenes(si aporta en algo) */) => {
  setLoading(true)
  axiosClient.get('/ventas')
    .then(({ data }) => {
      const ventas = data.ventas
      setVentas(ventas)
      setLoading(false)
    })
    .catch(error => {
      const messageError = error.response.data
      console.log(messageError);
      setLoading(false)
    })
}