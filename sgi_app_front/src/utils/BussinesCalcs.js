export function calcularTotal(cantidad, precio, cantidadConDescuento, porcentajeDescuento) {
    // Precio total sin descuento
    let precioTotalSinDescuento = cantidad * precio;
    
    // Descuento total
    let descuento = (cantidadConDescuento * precio) * (porcentajeDescuento / 100);
    
    // Precio total con descuento aplicado
    let precioTotalConDescuento = precioTotalSinDescuento - descuento;
    
    return precioTotalConDescuento;
}