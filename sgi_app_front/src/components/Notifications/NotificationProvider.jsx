import React, { useReducer } from 'react'
import { v4 } from 'uuid'
import Notification from './Notification'
import './Notification.css'
import { UilExclamationTriangle } from '@iconscout/react-unicons'
import { UilCheckCircle } from '@iconscout/react-unicons'
import { Avatar } from '@mui/material'

const NotificationProvider = (props) => {
    const [state, dispatch] = useReducer((state, action) => {

      switch(action.type) {
        case 'ADD_NOTIFICATION':
          return [...state, {...action.payload}]
        case 'REMOVE_NOTIFICATION':
          return state.filter(el => el.id !== action.id)
        default:
          return state
      }

    }, [
      {
        id: v4(),
        type: 'success',
        title: 'Exito',
        icon: <UilCheckCircle />,
        message: ''
      },
      {
        id: v4(),
        type: 'error',
        title: 'Error',
        icon: <UilExclamationTriangle />,
        message: ''
      },
      {
        id: v4(),
        type: 'update',
        title: 'Actualizacion',
        icon: <Avatar alt='user-img'/>,
        message: ''
      }
    ])
    


    return (
      <div>
        <div className='notificationWrapper'>
          {state.map(notification => {
            return <Notification dispatch={dispatch} key={notification.id} {...notification} />
          })}
        </div>
        {props.children}
      </div>
    )

}

export default NotificationProvider