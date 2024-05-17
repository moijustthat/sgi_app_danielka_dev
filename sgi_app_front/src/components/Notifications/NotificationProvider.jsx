import React from 'react'
import { v4 } from 'uuid'
import Notification from './Notification'
import './Notification.css'

const NotificationProvider = (props) => {

    const notifications = [
      {
        id: v4(),
        type: 'success',
        message: 'Test Success'
      },
      {
        id: v4(),
        type: 'error',
        message: 'Test Error'
      }
    ]

    return (
      <div>
        <div className='notificationWrapper'>
          {notifications.map(noti => {
            return <Notification key={noti.id} {...noti}/>
          })}
        </div>
        {props.children}
      </div>
    )
}

export default NotificationProvider