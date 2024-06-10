import React, {useState, useEffect} from 'react'
import './Cards.css'
import { CardsData } from '../../../../Data/Data'
import Card from '../../../Card/Card'
import axiosClient from '../../../../axios-client'


const Cards = () => {
    const [financialTotal, setFinancialTotal] = useState(0)
    const [loading, setLoading] = useState(false)

    const getFinancialInfo = async () => {
        setLoading(true)
        axiosClient.get("/financial_resume")
            .then(({data}) => {
                // Total financiero ordenes ultimas 24 horas
                const totales = data.totales
                const financialData = {
                    'Ordenes' : totales.ordenes.totalOrdenes,
                    'Ventas' : totales.ventas.totalVentas,
                    'Ganancias': Number(totales.ventas.totalVentas) - Number(totales.ordenes.totalOrdenes)
                }
                setFinancialTotal(financialData)
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setLoading(false)
            })
    }


    useEffect(() => {
        getFinancialInfo()
    }, [])

    if (loading) return
    else return (
        <div className='Cards'>
            {CardsData.map((card, id) => {
                return (
                    <div key={id} className='parentContainer'>
                        <Card
                            key={id}
                            title={card.title}
                            color={card.color}
                            barValue={card.barValue}
                            value={financialTotal[card.title]}
                            png={card.png}
                            series={card.series}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default Cards