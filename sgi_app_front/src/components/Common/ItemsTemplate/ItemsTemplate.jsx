import React, {useState} from 'react'
import './ItemsTemplate.css'
import logo from '../../../imgs/logo.png'
import { TiPrinter } from "react-icons/ti";
import { IoMdDownload } from "react-icons/io";
import { GrFormAdd } from "react-icons/gr";
import { TextField, SelectField, DateField, ImgField } from '../AwesomeFields/AwesomeFields';
import { FcCancel } from "react-icons/fc";
import { FcAcceptDatabase } from "react-icons/fc";
import { InputLabel } from '@mui/material';
const ItemsTemplate = ({
    rows = [],
    newLabel = 'Nuevo registro',
    newIcon = <GrFormAdd />,
    newInputs=[],
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
    onCreateNew=()=>null
}) => {

    const createDataItem = () => {
        const dataItem = {}
        for (let {label, type} of newInputs) {
            dataItem[label] = type==='select' ? 'empty' : ''
        }
        return dataItem
    }

    const [newItem, setNewItem] = useState(false)
    const [dataNewItem, setDataNewItem] = useState(createDataItem())



    const columns = rows.length > 0 ? Object.keys(rows[0]) : []

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
                                                    {columns.map(column => (
                                                        <td>{row[column]}</td>
                                                    ))}
                                                </tr>
                                            </>)
                                        })}
                                        <tr>
                                            <td style={{display: newLabel !== 'blocked' && newItem ? 'none' : ''}} >
                                                <button 
                                                    type='button' 
                                                    className='itemTemplateBtn'
                                                    onClick={()=>setNewItem(true)}
                                                    >
                                                    <span>{newIcon}</span>
                                                    <span>{newLabel}</span>
                                                </button>
                                            </td>
                                                
                                                    {newInputs.map(input=>{
                                                        switch(input.type){
                                                            case 'text':
                                                                return <td style={{display: newItem ? '' : 'none'}}><TextField 
                                                                    value={dataNewItem[input.label]}
                                                                    label={input.label}
                                                                    onChange={(value, setErr, setWarning)=>{
                                                                        if (input.validate(value)) {
                                                                            setDataNewItem({
                                                                                ...dataNewItem,
                                                                                [input.label]: value
                                                                            })
                                                                        }
                                                                    }}
                                                                />
                                                                </td>
                                                            break;
                                                            case 'select':
                                                                return <td style={{display: newItem ? '' : 'none'}}><SelectField 
                                                                value={dataNewItem[input.label]}
                                                                label={input.label}
                                                                options={input.options}
                                                                onChange={(value, setErr, setWarning)=>{
                                                                    setDataNewItem({
                                                                        ...dataNewItem,
                                                                        [input.label]: value
                                                                    })
                                                                }}
                                                                />
                                                                </td>
                                                            break;
                                                            case 'date':
                                                                return <td style={{display: newItem ? '' : 'none'}}><DateField 
                                                                value={dataNewItem[input.label]}
                                                                label={input.label}
                                                                onChange={(value, setErr, setWarning)=>{
                                                                    setDataNewItem({
                                                                        ...dataNewItem,
                                                                        [input.label]: value
                                                                    })
                                                                }}
                                                                />
                                                                </td>
                                                            break
                                                            case 'img':
                                                                return <td style={{display: newItem ? '' : 'none'}}><ImgField 
                                                                value={dataNewItem[input.label]}
                                                                label={input.label}
                                                                onChange={(value, setErr, setWarning)=>{
                                                                    setDataNewItem({
                                                                        ...dataNewItem,
                                                                        [input.label]: value
                                                                    })
                                                                }}
                                                                />
                                                                </td>
                                                            break
                                                        }
                                                    })}
                                                    <td>
                                                        <div className='itemTemplateBtns'>
                                                            <button 
                                                            style={{display: newItem ? '' : 'none'}}
                                                            type='button' 
                                                            className='itemTemplateBtn'
                                                            onClick={()=>onCreateNew(dataNewItem)}
                                                            >
                                                                <span>{<FcAcceptDatabase />}</span>
                                                                <span>Aceptar</span>
                                                            </button>
                                                            <button 
                                                            style={{display: newItem ? '' : 'none'}}
                                                            type='button' 
                                                            className='itemTemplateBtn'
                                                            onClick={()=>setNewItem(false)}
                                                            >
                                                                <span>{<FcCancel />}</span>
                                                                <span>Cancelar</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                               
                                            
                                        </tr>
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

                        <div className='itemTemplateBtns'>
                            <button onClick={() => {
                                window.print()
                            }} type='button' className='itemTemplateBtn'>
                                <span><TiPrinter /></span>
                                <span>Imprimir</span>
                            </button>
                            <button type='button' className='itemTemplateBtn'>
                                <span><IoMdDownload /></span>
                                <span>Descargar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemsTemplate