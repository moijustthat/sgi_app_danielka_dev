import React from 'react'

import { UpdatesData } from '../../../../../Data/Data'
import './Updates.css'
import { Avatar } from '@mui/material'

const Updates = () => {
    return (
        <div className='Updates'>
            {UpdatesData.map((update, index) => {
                return (
                    <div className='update'>
                        <Avatar alt='usuario' src={update.img} />
                        <div className='notification'>
                            <div style={{marginBottom: '0.5rem'}}>
                                <span>{update.name}</span>
                                <span>{update.notification}</span>
                            </div>
                            <span>{update.time}</span>
                        </div>   
                    </div>
                )
            })}
        </div>
    )
}

export default Updates