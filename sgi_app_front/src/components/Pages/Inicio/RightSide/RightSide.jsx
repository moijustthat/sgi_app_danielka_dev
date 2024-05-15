import React from 'react'
import Updates from './Updates/Updates'
import MasVendidos from './MasVendidos/MasVendidos'
import './RightSide.css'

const RightSide = () => {
    return (
        <div className='RightSide'>
            <div>
                <h3>Actualizaciones</h3>
                <Updates />
            </div>
            <div>
                <h3>Productos mas vendidos</h3>
                <MasVendidos />
            </div>
        </div>
        
    )
}

export default RightSide