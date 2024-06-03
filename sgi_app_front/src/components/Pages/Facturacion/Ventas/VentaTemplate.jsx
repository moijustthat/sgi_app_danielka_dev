import React from 'react'
import './VentaTemplate.css'
import logo from '../../../../imgs/logo.png'
import { TiPrinter } from "react-icons/ti";
import { IoMdDownload } from "react-icons/io";

const VentaTemplate = ({ venta, detalles }) => {
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
                                <p><span className='texttBold'>Fecha</span>: {venta['Fecha']}</p>
                            </div>
                            <div className='ventaTemplateHeadMiddleRight textEnd'>
                                <p><span className='textBold'>venta No:</span> {venta.id}</p>
                            </div>
                        </div>
                        <div className='hr'></div>
                            <div className='ventaTemplateHeadBottom'>
                                <div className='ventaTemplateHeadBottomLeft'>
                                    <ul>
                                        <li className='textBold'>venta hecha a:</li>
                                        <li>{venta['Proveedor']}</li>
                                        {/** Aqui se puede poner la direccion del proveedor(u otros datos de este) */}
                                        <li>Managua, Nicaragua</li>
                                    </ul>
                                </div>
                                <div className='ventaTemplateHeadBottomRight'>
                                    <ul className='textEnd'>
                                        <li className='textBold'>venta hecha por:</li>
                                        <li>{venta['venta hecha por']}</li>
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
                                            <td className='textBold'>Precio</td>
                                            <td className='textBold'>Con descuento</td>
                                            <td className='textBold'>Descuento</td>
                                            <td className='textBold'>Subtotal</td>
                                            <td className='textBold'>Total</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detalles.map((detalle, index) => {
                                            return (<>
                                            <tr key={index}>
                                                <td>{detalle['Producto']}</td>
                                                <td>{detalle['Cantidad']}</td>
                                                <td>C$ {detalle['Precio']}</td>
                                                <td>{detalle['Con descuento']}</td>
                                                <td>{detalle['Descuento']}</td>
                                            </tr>
                                            </>)
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