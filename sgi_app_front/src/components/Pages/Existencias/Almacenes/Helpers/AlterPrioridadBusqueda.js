import axiosClient from "../../../../../axios-client"

export const textAlterPrioridadBusqueda = (from, to, almacenes) => {
  const nameFrom = almacenes.find(a=> String(a.id) === String(from))['Nombre']
  const nameTo = almacenes.find(a=> String(a.id) === String(to))['Nombre']
  return `Seguro deseas intercambiar la prioridad de busqueda del almacen: ${nameFrom} con la del almacen: ${nameTo}?`
}

const AlterPrioridadBusqueda = (from, to, almacenes) => {
  const payload = {from: Number(from), to: Number(to)}
  axiosClient.post('/almacen/orden', payload)
    .then(({data})=>{
      const reponse = data.message
      console.log(reponse)
    })
    .catch(error=>{
      console.log(error)
    })
}

export default AlterPrioridadBusqueda