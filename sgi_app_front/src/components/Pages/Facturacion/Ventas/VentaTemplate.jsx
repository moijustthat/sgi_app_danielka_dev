import React, {useState} from 'react'
import './VentaTemplate.css'
import logo from '../../../../imgs/logo.png'
import { TiPrinter } from "react-icons/ti";
import { FaRegFilePdf } from "react-icons/fa6";
import { IoMdDownload } from "react-icons/io";
import validateApi, { formatearNumeroConComas } from '../../../../utils/textValidation';
import { MdDelete } from "react-icons/md";
import { IconButton } from '@mui/material';
import { FaEdit } from "react-icons/fa";
import { ButtonGroup } from '@mui/material';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { ImCancelCircle } from "react-icons/im";
import { TextField } from '../../../Common/AwesomeFields/AwesomeFields';
import { connetor_plugin } from '../../../Common/ConnetorPrinter/ConnectorPlugin'

const VentaTemplate = ({ 
    venta, 
    detalles,
    title = 'Factura',
    imprimir = true,
    deleteItem = (i) => { },
    updateItem = (i) => { },
    setItem = () => { },
    edit = null,
    actions = true
}) => {

    const [cantidad, setCantidad] = useState('')
    const [precio, setPrecio] = useState('')
    const [descuento, setDescuento] = useState('')
    const [porcentaje, setPorcentaje] = useState('')

    return (
        <div className='ventaTemplateWrapper print-area'>
            <div className='ventaTemplate'>
                <div className='ventaTemplateContainer'>
                    <div className='ventaTemplateHead'>
                        <div className='ventaTemplateHeadTop'>
                            <div className='ventaTemplateHeadTopLeft textStart'>
                                <img src={logo} />
                                <h3>Ferreteria y materiales de construccion Danielka S.A</h3>
                            </div>
                            <div className='ventaTemplateHeadTopRight textEnd'>
                                <h3>Factura [Venta]</h3>
                            </div>
                        </div>
                        <div className='hr'/>
                        <div className='ventaTemplateHeadMiddle'>
                            <div className='ventaTemplateHeadMiddleLeft textStart'>
                                <p><span className='texttBold'>Fecha de emision</span>: {venta['Fecha']}</p>
                            </div>
                            <div className='ventaTemplateHeadMiddleRight textEnd'>
                                <p><span className='textBold'>Venta No:</span> {venta.id === 'new' ? 'Nueva venta en proceso' : venta.id}</p>
                            </div>
                        </div>
                        <div className='hr'></div>
                            <div className='ventaTemplateHeadBottom'>
                                <div className='ventaTemplateHeadBottomLeft'>
                                    <ul>
                                        <li className='textBold'>Venta hecha a:</li>
                                        <li>{venta['Cliente']}</li>
                                        <li>Managua, Nicaragua</li>
                                    </ul>
                                </div>
                                <div className='ventaTemplateHeadBottomRight'>
                                    <ul className='textEnd'>
                                        <li className='textBold'>venta hecha por:</li>
                                        <li>{venta['Venta hecha por']}</li>
                                        {/** Aqui se puede poner el email del empleado(u otros datos de este) */}
                                    </ul>
                                </div>
                            </div>

                        <div className='overFlowView'>
                            <div className='ventaTemplateBody'>
                                <table>
                                    <thead>
                                        <tr>
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
                                                        <button onClick={() => {
                                                            setItem(prev => {
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
                                                    <td style={{ background: '#DA5854', color: '#FFF' }}>C$ {formatearNumeroConComas((Number(cantidad ? cantidad : 0) * (parseFloat(precio ? precio : 0) / 1.15).toFixed(2)).toFixed(2))}</td>

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

                                <div className='ventaTemplateBodyBottom'>
                                    <div className='ventaTemplateBodyInfoItem borderBottom'>
                                        <div className='infoItemTd textEnd textBold'>Sub Total:</div>
                                        <div className='infoItemTd textEnd'>C$ {venta['Subtotal']}</div>
                                    </div>
                                    <div className='ventaTemplateBodyInfoItem'>
                                        <div className='infoItemTd textEnd textBold'>Total:</div>
                                        <div className='infoItemTd textEnd'>C$ {venta['Total']}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='ventaTemplateFoot textCenter'>
                        <p><span className='textBold textCenter'>NOTE:&nbsp;</span>Esta es una factura generada por una computadora y no requiere una firma fisica.</p>
                    
                        <div className='ventaTemplateBtns'>
                            <button onClick={()=>{
                                window.print()
                            }} type='button' className='ventaTemplateBtn'>
                                <span><TiPrinter /></span>
                                <span>Imprimir</span>
                            </button>
                            <button type='button' className='ventaTemplateBtn'>
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

export default VentaTemplate