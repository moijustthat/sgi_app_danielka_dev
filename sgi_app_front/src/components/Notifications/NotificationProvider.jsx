import React, { createContext, useReducer } from 'react'
import { v4 } from 'uuid'
import Notification from './Notification'
import './Notification.css'


export const NotificationContext = createContext()

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

    }, [])
    
    /** 
     * Notification model:
     *       {
        id: v4(),
        type: 'error',
        title: 'Error',
        icon: <UilExclamationTriangle />,
        message: ''
      },
     * 
    */

    return (
      <NotificationContext.Provider value={dispatch}>
        <div className='notificationWrapper'>
          {state.map(notification => {
            return <Notification dispatch={dispatch} key={notification.id} {...notification} />
          })}
        </div>
        {props.children}
      </NotificationContext.Provider>
    )

}

export default NotificationProvider