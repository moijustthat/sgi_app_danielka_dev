import React from 'react'
import { v4 } from 'uuid'
import Notification from './Notification'
import './Notification.css'
import { UilExclamationTriangle } from '@iconscout/react-unicons'
import { UilCheckCircle } from '@iconscout/react-unicons'

const NotificationProvider = (props) => {

    const notifications = [
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
      }
    ]


    const notification = notifications.find(noti => noti.type === props.type)

    if (props.message === '') return

    notification.message = props.message
    return (
      <div>
        <div className='notificationWrapper'>
         <Notification key={notification.id} {...notification}/>
        </div>
        {props.children}
      </div>
    )

}

export default NotificationProvider