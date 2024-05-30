import React from 'react'
import './Adder.css'

const Adder = ({onPlus,onMinus}) => {
    return (
        <div className='adderWraper'>
            <div className='minus'><p onClick={onMinus}>-</p></div>
            <div className='plus'><p onClick={onPlus}>+</p></div>
        </div>
    )
}

export default Adder