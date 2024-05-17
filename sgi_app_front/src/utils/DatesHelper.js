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

