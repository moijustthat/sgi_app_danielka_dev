export function eliminarElementoPorIndice(array, indice) {
    if (indice > -1 && indice < array.length) {
        array.splice(indice, 1);
    } else {
        console.error('Índice fuera de rango');
    }
    return array;
}