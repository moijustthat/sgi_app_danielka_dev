import React from 'react'
import './components.css'
const Header = ({nombreUsuario}) => {
  return (
    <div className='profileHeader'>
      <h2>{nombreUsuario}</h2>
    </div>
  )
}

export default Header