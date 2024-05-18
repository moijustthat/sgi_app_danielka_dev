import React from "react"
import './Resume.css'

const Resume = ({dataSet, calcs}) => {
    return (
        <div className="Resume">
            {calcs.map(calc => calc(dataSet))}
        </div>
    )  
}

export default Resume