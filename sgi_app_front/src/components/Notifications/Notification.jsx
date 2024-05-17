import React, { useEffect, useState } from 'react'


const Notification = (props) => {

    const [width, setWidth] = useState(0)
    const [intervalId, setIntervalId] = useState(null)
    const [toShow, setToShow] = useState('')

    const handleStartTimer = () => {
        const id = setInterval(() => {
            setWidth(prev => {
                if (prev < 100) return prev + 0.5
   
                return prev
            })
        }, 20)

        setIntervalId(id)
    }

    const handleClose = () => {
        if (width < 100) return
        setToShow('slideRight')
    }
    
    useEffect(() => {
        handleStartTimer()
    }, [])

    return (
        <div onClick={handleClose} className={`notificationItem ${toShow} ${props.type}`}>
            <span>{props.icon}</span>
            <p className='title'>{props.title}</p>
            <p className='message'>{props.message}</p>
            <div className='bar' style={{width: `${width}%`}}></div>
        </div>
    )
}

export default Notification