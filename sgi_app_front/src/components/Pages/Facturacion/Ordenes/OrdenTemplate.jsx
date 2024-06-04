import React, { useEffect, useState } from 'react'
import './OrdenTemplate.css'
import logo from '../../../../imgs/logo.png'
import { TiPrinter } from "react-icons/ti";
import { IoMdDownload } from "react-icons/io";
import validateApi, { formatearNumeroConComas } from '../../../../utils/textValidation';
import { MdDelete } from "react-icons/md";
import { IconButton } from '@mui/material';
import { FaEdit } from "react-icons/fa";
import { ButtonGroup } from '@mui/material';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { ImCancelCircle } from "react-icons/im";
import { TextField } from '../../../Common/AwesomeFields/AwesomeFields';
const OrdenTemplate = ({ orden,
    detalles,
    title = 'Factura',
    imprimir = true,
    deleteItem = (i) => { },
    updateItem = (i) => { },
    setItem = () => { },
    edit = null,
    actions=true
}) => {

    const [cantidad, setCantidad] = useState('')
    const [precio, setPrecio] = useState('')
    const [descuento, setDescuento] = useState('')
    const [porcentaje, setPorcentaje] = useState('')

    return (
        <div className='ordenTemplateWrapper print-area'>
            <div className='ordenTemplate'>
                <div className='ordenTemplateContainer'>
                    <div className='ordenTemplateHead'>
                        <div className='ordenTemplateHeadTop'>
                            <div className='ordenTemplateHeadTopLeft textStart'>
                                <img src={logo} />
                                <h3>Ferreteria y materiales de construccion Danielka S.A</h3>
                            </div>
                            <div className='ordenTemplateHeadTopRight textEnd'>
                                <h3>{title} [Orden]</h3>
                            </div>
                        </div>
                        <div className='hr' />
                        <div className='ordenTemplateHeadMiddle'>
                            <div className='ordenTemplateHeadMiddleLeft textStart'>
                                <p><span className='texttBold'>Fecha de emision</span>: {orden['Fecha emision']}</p>
                            </div>
                            <div className='ordenTemplateHeadMiddleRight textEnd'>
                                <p><span className='textBold'>Orden No:</span> {orden.id === 'new' ? 'Nueva orden en proceso' : orden.id}</p>
                            </div>
                        </div>
                        <div className='hr'></div>
                        <div className='ordenTemplateHeadBottom'>
                            <div className='ordenTemplateHeadBottomLeft'>
                                <ul>
                                    <li className='textBold'>Orden hecha a:</li>
                                    <li>{orden['Proveedor']}</li>
                                    {/** Aqui se puede poner la direccion del proveedor(u otros datos de este) */}
                                    <li>Managua, Nicaragua</li>
                                </ul>
                            </div>
                            <div className='ordenTemplateHeadBottomRight'>
                                <ul className='textEnd'>
                                    <li className='textBold'>Orden hecha por:</li>
                                    <li>{orden['Orden hecha por']}</li>
                                    {/** Aqui se puede poner el email del empleado(u otros datos de este) */}
                                </ul>
                            </div>
                        </div>

                        <div className='overFlowView'>
                            <div className='ordenTemplateBody'>
                                <table>
                                    <thead>
                                        <tr>
                                            {actions ? <td></td> : null}
                                            <td className='textBold'>Producto</td>
                                            <td className='textBold'>Cantidad</td>
                                            <td className='textBold'>Precio unitario</td>
                                            <td className='textBold' style={{ display: edit !== null ? '' : 'none' }}>Descuento</td>
                                            <td className='textBold' style={{ display: edit !== null ? '' : 'none' }}>Porcentaje</td>
                                            <td className='textBold'>Importe</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detalles.map((detalle, index) => {
                                            if (edit !== null && index === edit) {
                                                return <tr key={index}>
                                                    <div className='ordenTemplateBtns'>
                                                        <button onClick={()=>{
                                                            setItem(prev=>{
                                                                const copyList = [...prev]
                                                                const copyItem = copyList[index]
                                                                const updatedItem = {
                                                                    ...copyItem,
                                                                    Cantidad: cantidad !== '' ? cantidad : detalle['Cantidad'],
                                                                    'Precio de compra': precio !== '' ? precio : detalle['Precio'],
                                                                    'Cantidad con descuento': descuento !== '' ? descuento : detalle['Descuento'],
                                                                    'Porcentaje de descuento': porcentaje !== '' ? porcentaje : detalle['Porcentaje']
                                                                }
                                                                copyList[index] = updatedItem
                                                                setCantidad('')
                                                                setPrecio('')
                                                                setDescuento('')
                                                                setPorcentaje('')
                                                                return copyList
                                                            })
                                                            updateItem(null)
                                                        }} type='button' className='ordenTemplateBtn'>
                                                            <span><UpgradeIcon /></span>
                                                            <span>Aceptar</span>
                                                        </button>
                                                        <button onClick={() => updateItem(null)} type='button' className='ordenTemplateBtn'>
                                                            <span><ImCancelCircle /></span>
                                                            <span>Cancelar</span>
                                                        </button>
                                                    </div>
                                                    <td>{detalle['Producto']}</td>

                                                    <td style={{ display: edit !== null ? '' : 'none' }}><TextField
                                                        value={cantidad}
                                                        placeholder={detalle['Cantidad']}
                                                        onChange={(value) => {
                                                            if (validateApi.number(value)) {
                                                                setCantidad(value)
                                                            }
                                                        }}
                                                    /></td>
                                                    <td style={{ display: edit !== null ? '' : 'none' }}><TextField
                                                        value={precio}
                                                        placeholder={detalle['Precio'] + ' (precio con iva)'}
                                                        onChange={(value) => {
                                                            if (validateApi.positiveReal(value) && validateApi.priceTruncated(value)) {
                                                                setPrecio(value)
                                                            }
                                                        }}
                                                    /></td>
                                                    <td style={{ display: edit !== null ? '' : 'none' }}><TextField
                                                        value={descuento}
                                                        placeholder={detalle['Descuento']}
                                                        onChange={(value) => {
                                                            if (validateApi.positiveIntegerOrZero(value)) {
                                                                setDescuento(value)
                                                            }
                                                        }}
                                                    /></td>
                                                    <td style={{ display: edit !== null ? '' : 'none' }}><TextField
                                                        value={porcentaje}
                                                        placeholder={detalle['Porcentaje']}
                                                        onChange={(value) => {
                                                            if (validateApi.decimalPositiveOrZero(value)) {
                                                                setPorcentaje(value)
                                                            }
                                                        }}
                                                    /></td>
                                                    <td style={{background: '#DA5854', color: '#FFF'}}>C$ {formatearNumeroConComas((Number(cantidad ? cantidad : 0) * (parseFloat(precio ? precio : 0) / 1.15).toFixed(2)).toFixed(2))}</td>

                                                </tr>
                                            } else {
                                                return <tr key={index}>
                                                    {actions ? <td>
                                                        <ButtonGroup color="secondary" aria-label="Medium-sized button group">
                                                            <IconButton onClick={() => deleteItem(index)}>
                                                                <MdDelete />
                                                            </IconButton>
                                                            <IconButton onClick={() => updateItem(index)}>
                                                                <FaEdit />
                                                            </IconButton>
                                                        </ButtonGroup>
                                                    </td> : null}
                                                    <td>{detalle['Producto']}</td>
                                                    <td>{formatearNumeroConComas(detalle['Cantidad'])}</td>
                                                    <td>C$ {formatearNumeroConComas((parseFloat(detalle['Precio']) / 1.15).toFixed(2))}</td>
                                                    <td>C$ {formatearNumeroConComas((Number(detalle['Cantidad']) * (parseFloat(detalle['Precio']) / 1.15).toFixed(2)).toFixed(2))}</td>
                                                </tr>
                                            }


                                        })}
                                    </tbody>
                                </table>

                                <div className='ordenTemplateBodyBottom'>
                                    <div className='ordenTemplateBodyInfoItem borderBottom'>
                                        <div className='infoItemTd textEnd textBold'>Sub Total:</div>
                                        <div className='infoItemTd textEnd'>C$ {formatearNumeroConComas(orden['Subtotal'])}</div>
                                    </div>

                                    <div className='ordenTemplateBodyInfoItem borderBottom'>
                                        <div className='infoItemTd textEnd textBold'>IVA 15.0%</div>
                                        <div className='infoItemTd textEnd'>C$ {formatearNumeroConComas((parseFloat(orden['Subtotal']) * 0.15).toFixed(2))}</div>
                                    </div>
                                    <div style={{ display: String(orden['Descuento']) !== '0' ? '' : 'none' }} className='ordenTemplateBodyInfoItem borderBottom'>
                                        <div className='infoItemTd textEnd textBold'>Descuento</div>
                                        <div className='infoItemTd textEnd'>C$ {formatearNumeroConComas(orden['Descuento'])}</div>
                                    </div>
                                    <div style={{ display: String(orden['Cargos por mora']) !== '0' ? '' : 'none' }} className='ordenTemplateBodyInfoItem borderBottom'>
                                        <div className='infoItemTd textEnd textBold'>Descuento</div>
                                        <div className='infoItemTd textEnd'>C$ {formatearNumeroConComas(orden['Cargos por mora'])}</div>
                                    </div>
                                    <div className='ordenTemplateBodyInfoItem'>
                                        <div className='infoItemTd textEnd textBold'>Total:</div>
                                        <div className='infoItemTd textEnd'>C$ {formatearNumeroConComas(orden['Total'])}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='ordenTemplateFoot textCenter'>
                        <p><span className='textBold textCenter'>NOTE:&nbsp;</span>Esta es una factura generada por una computadora y no requiere una firma fisica.</p>

                        <div style={{ display: imprimir ? '' : 'none' }} className='ordenTemplateBtns'>
                            <button onClick={() => {
                                window.print()
                            }} type='button' className='ordenTemplateBtn'>
                                <span><TiPrinter /></span>
                                <span>Imprimir</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrdenTemplate