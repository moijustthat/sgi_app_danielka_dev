import React, { useState } from 'react'
import './EntregaTemplate.css'
import logo from '../../../../imgs/logo.png'
import { TiPrinter } from "react-icons/ti";
import { IoMdDownload } from "react-icons/io";
import { GrFormAdd } from "react-icons/gr";
import { TextField, SelectField, DateField, ImgField } from '../../../Common/AwesomeFields/AwesomeFields'
import { FcCancel } from "react-icons/fc";
import { FcAcceptDatabase } from "react-icons/fc";
import { InputLabel } from '@mui/material';
import { MdCancel } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import validateApi from '../../../../utils/textValidation'
import * as DateHelper from '../../../../utils/DatesHelper'
import axiosClient from '../../../../axios-client';

const EntregaTemplate = ({
    rows = [],
    data= [],
    setRows=()=>{},
    almacenes=[],
    newLabel = 'Nuevo registro',
    newIcon = <GrFormAdd />,
    newInputs = [],
    header = {
        title: 'Titulo header',
        row1LeftLabel: 'row1LeftLabel',
        row1LeftValue: 'row1LeftValue',
        row1RightLabel: 'row1RightLabel',
        row1RightValue: 'row1RightValue',
        row2LeftLabel: 'row2LeftLabel',
        row2LeftValue: 'row2LeftValue',
        row2RightLabel: 'row2RightLabel',
        row2RightValue: 'row2RightValue',
    },
    body = {},
    footer = {},
    onCreateNew = () => null
}) => {

    const columns = rows.length > 0 ? Object.keys(rows[0]) : []

    const onIngresarOrden = () => {
        
        for(let row of data) {
           if (row['Almacen'] === 'empty' || row['Almacen'] === '' || row['Fecha de vencimiento stock'] === '' || row['Fecha de vencimiento stock'] === 'empty') return
        }

        axiosClient.post('/entrada/orden',{entrada: data})
            .then(({data})=>{
                const response = data.mensaje
                console.log(response)
            })
            .catch(error=>{
                console.log(error)
            })
        
        
    }

    return (
        <div className='itemTemplateWrapper print-area'>
            <div className='itemTemplate'>
                <div className='itemTemplateContainer'>
                    <div className='itemTemplateHead'>
                        <div className='itemTemplateHeadTop'>
                            <div className='itemTemplateHeadTopLeft textStart'>
                                <img src={logo} />
                                <h3>Ferreteria y materiales de construccion Danielka S.A</h3>
                            </div>
                            <div className='itemTemplateHeadTopRight textEnd'>
                                <h3>{header.title}</h3>
                            </div>
                        </div>
                        <div className='hr' />
                        <div className='itemTemplateHeadMiddle'>
                            <div className='itemTemplateHeadMiddleLeft textStart'>
                                <p><span className='textBold'>{header.row1LeftLabel}</span>: {header.row1LeftValue}</p>
                            </div>
                            <div className='itemTemplateHeadMiddleRight textEnd'>
                                <p><span className='textBold'>{header.row1RightLabel}:</span> {header.row1RightValue}</p>
                            </div>
                        </div>
                        <div className='hr'></div>
                        <div className='itemTemplateHeadBottom'>
                            <div className='itemTemplateHeadBottomLeft'>
                                <ul>
                                    <li className='textBold'>{header.row2LeftLabel}:</li>
                                    <li>{header.row2LeftValue}</li>
                                    <li>
                                        <button
                                            type='button'
                                            className='itemTemplateBtn'
                                            onClick={() => onIngresarOrden()}
                                        >
                                            <span>Ingresar orden</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className='itemTemplateHeadBottomRight'>
                                <ul className='textEnd'>
                                    <li className='textBold'>{header.row2RightLabel}:</li>
                                    <li>{header.row2RightValue}</li>
                                    {/** Aqui se puede poner el email del empleado(u otros datos de este) */}
                                </ul>
                            </div>
                        </div>

                        <div className='overFlowView'>
                            <div className='itemTemplateBody'>
                                <table>
                                    <thead>
                                        <tr>
                                            {columns.length > 0 ?
                                                columns.map(column => (
                                                    <td className='textBold'>{column}</td>
                                                )) : ''}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => {
                                            return (<>
                                                <tr key={index}>
                                                    {columns.map(column => {
                                                        if (column ==='Almacen') {
                                                            return <td><SelectField 
                                                                value={rows[index]['Almacen']}
                                                                label='Almacen'
                                                                options={almacenes}
                                                                onChange={(value)=>{
                                                                setRows(index, 'Almacen', value)
                                                                }}
                                                            /></td>
                                                        } else if (column === 'Fecha de vencimiento stock') {
                                                            if (rows[index]['Fecha de vencimiento stock']!=='No caduca') {
                                                                return <td><DateField 
                                                                value={rows[index]['Fecha de vencimiento stock']}
                                                                label='Fecha de vencimiento'
                                                                onChange={(value)=>{
                                                                    if (DateHelper.isGreater(value, DateHelper.getCurrentDate())) {
                                                                        setRows(index, 'Fecha de vencimiento stock', value)
                                                                    }
                                                                }}
                                                            /></td>
                                                            } else {
                                                                return <td>Este producto no caduca</td>
                                                            }
                                                            
                                                        } else {
                                                            return <td>{row[column]}</td>

                                                        }
                                                    })}
                                                </tr>
                                            </>)
                                        })}
                                    </tbody>
                                </table>

                                <div className='itemTemplateBodyBottom'>
                                    {footer.map((foot, index) => (
                                        <div key={index} className='itemTemplateBodyInfoItem borderBottom'>
                                            <div className='infoItemTd textEnd textBold'>{foot.label}</div>
                                            <div className='infoItemTd textEnd'>{foot.value}</div>
                                        </div>
                                    ))}


                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='itemTemplateFoot textCenter'>
                        <p><span className='textBold textCenter'>NOTE:&nbsp;</span>Esta es un informe generado por una computadora y no requiere una firma fisica.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EntregaTemplate