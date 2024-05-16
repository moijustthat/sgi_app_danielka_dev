import React from 'react'
import Banner from '../../../Common/Banner/Banner'
import { Button, Grid } from '@mui/material'

import './AddProducto.css'

const AddProducto = ({setOpen}) => {
  return (
    <div className='container'>
      <div className='glass'>
        <button onClick={() => setOpen(false)}>Cancelar</button>
      </div>
    </div>

  )
}

export default AddProducto