import { useState } from 'react'

import './Card.css'

import { motion, LayoutGroup } from 'framer-motion'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Chart from 'react-apexcharts'

import { UilTimes } from '@iconscout/react-unicons'

import * as DateHelper from '../../utils/DatesHelper'

const Card = (props) => {

    const [expanded, setExpanded] = useState(false)

    return (
        <LayoutGroup id={props.title}>
            {
                expanded ?  <ExpandedCard param={props} setExpanded={() => setExpanded(false)}/>
                            :
                            <CompactCard param={props} setExpanded={() => setExpanded(true)}/>
            }
        </LayoutGroup>
    )
}

// Compact Card
function CompactCard({param, setExpanded}) {

    return (
        <motion.div className='CompactCard'
            style={{
                background: param.color.background,
                boxShadow: param.color.boxShadow
            }}
            onClick={setExpanded}
            layoutId='expandableCard'
        >
            <div className='radialBar'>
                <CircularProgressbar 
                    value={param.barValue}
                    text={`${param.barValue}%`}
                />
                <span>{param.title}</span>
            </div>
            <div className='detail'>
                {param.png}
                <span>${param.value}</span>
                <span>{DateHelper.getCurentTime() >= '08:00:00' && DateHelper.getCurentTime() <= '17:00:00' ? 'Hoy' : 'Ayer'}</span>
            </div>
        </motion.div>
    )
}

function ExpandedCard({param, setExpanded}) {

    const data = {
        options: {
            chart: {
                type: 'line'
              },
              series: [{
                name: 'sales',
                data: [30,40,35,50,49,60,70,91,125]
              }],
              xaxis: {
                categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
              }
        }
    }

    return (
        <motion.div className='ExpandedCard'
            style={{
                background: param.color.background,
                boxShadow: param.color.boxShadow
            }}
            layoutId='expandableCard'
        >
            <div
                style={{
                    alignSelf: 'flex-end',
                    cursor: 'pointer',
                    color: 'white'
                }}
            >
                <UilTimes onClick={setExpanded} />
            </div>
            <span>{param.title}</span>
            <div className='chartContainer'>
                <Chart series={param.series} type='area' options={data.options}/>
            </div>
            
        </motion.div>
    )
}

export default Card