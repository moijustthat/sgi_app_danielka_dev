import React from 'react'
import './Adder.css'
import { MdOutlineDelete } from "react-icons/md";

const Adder = ({onPlus,onMinus, counter=0, onDelete=()=>null, blocked=false}) => {
    return (
        <div className='adderWraper'>
            <p onClick={onDelete} style={{display: counter > 0 ? '' : 'none'}} className='deleteCounter'><MdOutlineDelete /></p>
            <div className='minus'><p onClick={()=> !!!blocked && onMinus()}>-</p></div>
            <div style={{display: counter > 0 ? '' : 'none'}} className='counter'><p>{counter}</p></div>
            <div className='plus'><p onClick={()=> !!!blocked && onPlus()}>+</p></div>
        </div>
    )
}

export default Adder