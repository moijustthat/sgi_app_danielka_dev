import React from 'react'
import './OrdenTemplate.css'
import logo from '../../../../imgs/logo.png'

const OrdenTemplate = ({ orden, detalles }) => {
    return (
        <div className='ordenTemplateWrapper'>
            <div className='ordenTemplate'>
                <div className='ordenTemplateContainer'>
                    <div className='ordenTemplateHead'>
                        <div className='ordenTemplateHeadTop'>
                            <div className='ordenTemplateHeadTopLeft textStart'>
                                <img src={logo} />
                            </div>
                            <div className='ordenTemplateHeadTopRight textEnd'>
                                <h3>Factura [Orden]</h3>
                            </div>
                        </div>

                        <div className='hr'></div>
                        <div className='ordenTemplateHeadMiddle'>
                            <div className='ordenTemplateHeadMiddleLeft textStart'>
                                <p><span className='texttBold'>Fecha</span>: {orden['Fecha']}</p>
                            </div>
                            <div className='ordenTemplateHeadMiddleRight textEnd'>
                                <p><span className='textBold'>Orden No:</span> {orden.id}</p>
                            </div>
                        </div>
                        <div className='hr'>
                            <div className='ordenTemplateHeadBottom'>
                                <div className='ordenTemplateHeadBottomLeft'>
                                    <ul>
                                        <li className='textBold'>Orden para:</li>
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
                        </div>

                        <div className='overFlowView'>
                            <div className='ordenTemplateBody'>
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
                                            return (<tr key={index}>
                                                <td>{detalle['Producto']}</td>
                                                <td>{detalle['Cantidad']}</td>
                                                <td>{detalle['Precio']}</td>
                                                <td>{detalle['Con descuento']}</td>
                                                <td className='textEnd'>{detalle['Descuento']}</td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>

                                <div className='ordenTemplateBodyBottom'>
                                    <div className='ordenTemplateBodyInfoItem borderBottom'>
                                        <div className='infoItemTd textEnd textBold'>Sub Total:</div>
                                        <div className='infoItemTd textEnd'>C$ {orden['Subtotal']}</div>
                                    </div>
                                    <div className='ordenTemplateBodyInfoItem'>
                                        <div className='infoItemTd textEnd textBold'>Total:</div>
                                        <div className='infoItemTd textEnd'>C$ {orden['Total']}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='ordenTemplateFoot textCenter'>
                        <p><span className='textBold textCenter'>NOTE:&nbsp;</span>Esta es una factura generada por una computadora y no requiere una firma fisica.</p>
                    
                        <div className='ordenTemplateBtns'>
                            <button type='button' className='ordenTemplateBtn'>
                                <span><i className='fa-solid fa-print'></i></span>
                                <span>Imprimir</span>
                            </button>
                            <button type='button' className='ordenTemplateBtn'>
                                <span><i className='fa-solid fa-download'></i></span>
                                <span>Descargar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrdenTemplate