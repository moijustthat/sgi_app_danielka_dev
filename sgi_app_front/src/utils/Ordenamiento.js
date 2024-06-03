export function ordenarPorAtributo(arr, atributo) {
    return arr.sort((a, b) => {
        if (a[atributo] < b[atributo]) {
            return -1;
        }
        if (a[atributo] > b[atributo]) {
            return 1;
        }
        return 0;
    });
}