export function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }

    return edad;
}

// () -> Date
const padZero = (str, amount) => {
    str = String(str)
    let output = ''

    if (str.length >= amount) return str

    for (let i = 0; i < amount - str.length; i++) {
        output += '0'
    }

    return output + str
} 

export const getCurentTime = () => {
    const fechaActual = new Date();
    const horas = String(fechaActual.getHours()).padStart(2, '0');
    const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
    const segundos = String(fechaActual.getSeconds()).padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
}

export const getCurrentDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = padZero(today.getMonth()+1, 2) // los meses comienzan en cero en Date
    const day = padZero(today.getDate(), 2)

    return `${year}-${month}-${day}`
}


// (String, String) -> Bool
export const isGreater = (date1, date2) => {
    // Convertir strings en objetos Date
    const dateObj1 = new Date(date1)
    const dateObj2 = new Date(date2)

    return dateObj1 > dateObj2
}

// (String, String) -> Bool
export const isEqual = (date1, date2) => {
    // Convertir strings en objetos Date
    const dateObj1 = new Date(date1)
    const dateObj2 = new Date(date2)

    return dateObj1 === dateObj2
}

// (String, String) -> Bool
export const isLesser = (date1, date2) => {
    // Convertir strings en objetos Date
    const dateObj1 = new Date(date1)
    const dateObj2 = new Date(date2)

    return dateObj1 < dateObj2
}

// (String, String) -> Bool
export const isGreaterOrEqual = (date1, date2) => {
    // Convertir strings en objetos Date
    const dateObj1 = new Date(date1)
    const dateObj2 = new Date(date2)

    return dateObj1 >= dateObj2
}

// (String, String) -> Bool
export const isLesserOrEqual = (date1, date2) => {
    // Convertir strings en objetos Date
    const dateObj1 = new Date(date1)
    const dateObj2 = new Date(date2)

    return dateObj1 <= dateObj2
}

