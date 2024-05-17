import React, { useEffect, useState } from 'react'

const Notification = (props) => {

    const [width, setWidth] = useState(0)
    const [intervalId, setIntervalId] = useState(null)
    const [display, setDisplay] = useState('')

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
        setDisplay('none')
    }
    
    useEffect(() => {
        handleStartTimer()
    }, [])

    return (
        <div onClick={handleClose} style={{display: display}} className={`notificationItem ${props.type}`}>
            <p>{props.message}</p>
            <div className='bar' style={{width: `${width}%`}}></div>
        </div>
    )
}

export default Notification