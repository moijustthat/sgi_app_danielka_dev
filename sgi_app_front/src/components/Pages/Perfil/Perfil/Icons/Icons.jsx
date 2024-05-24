
import { useStateContext } from '../../../../Contexts/ContextProvider'
import './Icons.css'
import React from 'react'


export const IconInfo = ({icon, userInfo, nombreInfo}) => {


  return (
    <div className='iconInfoContainer'>
        
        {icon}
        <h3>{nombreInfo}</h3>
        <p>{userInfo}</p>
    </div>
  )
}

export default IconInfo

