import React from 'react'
import './Adder.css'
import { IconButton } from '@mui/material';
import { MdOutlineDelete } from "react-icons/md";

const Adder = ({onPlus,onMinus, counter=0, onDelete=()=>null}) => {
    return (
        <div className='adderWraper'>
            <p onClick={onDelete} style={{display: counter > 0 ? '' : 'none'}} className='deleteCounter'><MdOutlineDelete /></p>
            <div className='minus'><p onClick={onMinus}>-</p></div>
            <div style={{display: counter > 0 ? '' : 'none'}} className='counter'><p>{counter}</p></div>
            <div className='plus'><p onClick={onPlus}>+</p></div>
        </div>
    )
}

export default Adder