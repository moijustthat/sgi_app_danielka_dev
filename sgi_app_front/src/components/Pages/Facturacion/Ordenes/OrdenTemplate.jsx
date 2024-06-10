import React, { useEffect, useState } from 'react'
import './OrdenTemplate.css'
import logo from '../../../../imgs/logo.png'
import firma from '../../../../imgs/firma_test.png'
import { MdOutlineEmail } from "react-icons/md";
import { FaRegFilePdf } from "react-icons/fa6";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { IoMdDownload } from "react-icons/io";
import validateApi, { formatearNumeroConComas, obtenerTipoEntidad, convertirHoraAMPM } from '../../../../utils/textValidation';
import { MdDelete } from "react-icons/md";
import { IconButton } from '@mui/material';
import { FaEdit } from "react-icons/fa";
import { ButtonGroup } from '@mui/material';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { ImCancelCircle } from "react-icons/im";
import { TextField } from '../../../Common/AwesomeFields/AwesomeFields';
import { connetor_plugin } from '../../../Common/ConnetorPrinter/ConnectorPlugin'
import {convertirFechaEspaniol} from '../../../../utils/DatesHelper'


const OrdenTemplate = ({ 
    orden,
    detalles,
    title = '',
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

    async function imprimirTicket() {
        let nombreImpresora = "SuperImpresora";
        let api_key = "123"


        /*connetor_plugin.obtenerImpresoras()
                        .then(impresoras => {                    
                         console.log(impresoras)
                        });
        return*/
        const conector = new connetor_plugin()
        conector.fontsize("2")
        conector.textaling("center")
        conector.text("Ferreteria Danielka")
        conector.fontsize("1")
        conector.text("Monte Everest 4578 Las Cumbres Tijuana")
        conector.text("PECJ711218EZ9")
        conector.feed("3")
        conector.textaling("left")
        conector.text("Fecha: Miercoles 8 de Septiembre 2021 13:50")
        conector.text("Cant.           Descripcion         Importe")
        conector.text("----------------------------------------------------")
        conector.text("1- Barrote 2x4x8                    $110")
        conector.text("3- Esquinero Vinil                  $165")
        conector.feed("1")
        conector.fontsize("2")
        conector.textaling("center")
        conector.text("Total: $275")
        conector.qr("https://abrazasoft.com")
        conector.feed("5")
        conector.cut("0")

        const res = await conector.imprimir(nombreImpresora, api_key);
        if (res === true) {
            console.log('Impresion hecha con exito')
        } else {
            console.log("Problema al imprimir: " + res)

        }
    }


    return (
        <div className='ordenTemplateWrapper print-area'>
            <div className='ordenTemplate'>
                <div className='ordenTemplateContainer'>
                    <div className='ordenTemplateHead'>
                        <div className='ordenTemplateHeadTop'>
                            <div className='ordenTemplateHeadTopLeft textStart'>
                                <img src={logo} />
                                <h3>Ferreteria y materiales de construccion Danielka</h3>
                            </div>
                            <div className='ordenTemplateHeadTopRight textEnd'>
                                <h3>{`${title} Orden de compra`}</h3>
                            </div>
                        </div>
                        <div className='hr' />
                        <div className='ordenTemplateHeadMiddle'>
                            <div className='ordenTemplateHeadMiddleLeft textStart'>
                                <p><span className='texttBold'>Fecha de emision</span>: {convertirFechaEspaniol(orden['Fecha emision'])}</p>
                                <p><span className='texttBold'>Hora</span>: {convertirHoraAMPM(orden['Hora emision'])}</p>
                                <p><span className='texttBold'>{orden['Estado entrega']==='Esperando' ? 'Fecha para recibir orden' : 'Fecha de orden entegada'}</span>: {orden['Fecha de entrega']}</p>
                            </div>
                            <div className='ordenTemplateHeadMiddleRight textEnd'>
                                <p><span className='textBold'>Orden No:</span> {orden.id === 'new' ? 'Nueva orden en proceso' : orden.id}</p>
                            </div>
                        </div>
                        <div className='hr'></div>
                        <div className='ordenTemplateHeadBottom'>
                            <div className='ordenTemplateHeadBottomLeft'>
                                <ul>
                                    <li className='textBold'>Proveedor:</li>
                                    <li>{orden['Proveedor']}</li>
                                </ul>
                                <ul>
                                    <li className='textBold'>Numero RUC:</li>
                                    <li>{orden['Numero RUC']}</li>
                                    <li className='textBold'>Tipo de entidad tributaria:</li>
                                    <li>{obtenerTipoEntidad(orden['Numero RUC'])}</li>
                                </ul>
                            </div>
                            <div className='ordenTemplateHeadBottomRight'>
                                <ul className='textEnd'>
                                    <li className='textBold'>Orden hecha por:</li>
                                    <li>Ferreteria Danielka</li>
                                    <li>{orden['Orden hecha por']}</li>
                                    <li className='textBold'>Telefono ferreteria:</li>
                                    <li>22222222</li>
                                    <li className='textBold'>Numero RUC Ferreteria Danielka:</li>
                                    <li>M1231231231231</li>
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
                                                    <td>C$ {formatearNumeroConComas((parseFloat(detalle['Precio'])).toFixed(2))}</td>
                                                    <td>C$ {formatearNumeroConComas((Number(detalle['Cantidad']) * (parseFloat(detalle['Precio'])).toFixed(2)).toFixed(2))}</td>
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
                                    <div style={{ display: String(orden['Descuento']) !== '0' ? '' : 'none' }} className='ordenTemplateBodyInfoItem borderBottom'>
                                        <div className='infoItemTd textEnd textBold'>{`Descuento ${orden['Porcentaje']}%`}</div>
                                        <div className='infoItemTd textEnd'>C$ {formatearNumeroConComas(orden['Descuento'])}</div>
                                    </div>
                                    <div style={{ display: String(orden['Cargos por mora']) !== '0' ? '' : 'none' }} className='ordenTemplateBodyInfoItem borderBottom'>
                                        <div className='infoItemTd textEnd textBold'>Cargo por mora</div>
                                        <div className='infoItemTd textEnd'>C$ {formatearNumeroConComas(orden['Cargos por mora'])}</div>
                                    </div>
                                    <div className='ordenTemplateBodyInfoItem borderBottom'>
                                        <div className='infoItemTd textEnd textBold'>IVA 15.0%</div>
                                        <div className='infoItemTd textEnd'>C$ {formatearNumeroConComas( ((Number(orden['Subtotal']) - Number(orden['Descuento']) + Number(orden['Cargos por mora'])) * 0.15).toFixed(2) )}</div>
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
                        <div style={{ display: imprimir ? '' : 'none' }} className='ordenTemplateBtns'>
                            <button onClick={() => {
                                alert('Facturar orden')
                            }} type='button' className='ordenTemplateBtn'>
                                <span><LiaFileInvoiceDollarSolid /></span>
                                <span>Facturar orden</span>
                            </button>
                            <button onClick={() => {
                                alert('Email enviado')
                            }} type='button' className='ordenTemplateBtn'>
                                <span><MdOutlineEmail /></span>
                                <span>Enviar email</span>
                            </button>
                            <button onClick={() => {
                                window.print()
                            }} type='button' className='ordenTemplateBtn'>
                                <span><FaRegFilePdf /></span>
                                <span>Imprimir PDF</span>
                            </button>
                        </div>

                        <div className='Firma'>
                            <img width={100} height={70} src={firma}/>
                            <div className='line'></div>
                            <p>Firma</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrdenTemplate