import React from 'react'
import './Title.css'

const Title = (props) => {
    const {
        title,
        background,
        color,
        icon,
        description=''
    } = props
    return (
            <div className='TitleContainer'>
                <div className='Title'>
                <h3>{title}</h3>
                <span style={{
                    background: background,
                    color: color,
                }}>{icon}</span>
            </div>
                <p>*{description}</p>
            </div>
  )
}

export default Title