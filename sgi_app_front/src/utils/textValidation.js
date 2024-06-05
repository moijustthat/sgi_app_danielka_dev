export function validarFormatoConComas(cadena) {
    // Expresión regular para validar el formato numérico con comas
    const regex = /^(\d{1,3})(,\d{3})*(\.\d+)?$/;

    // Comprobamos si la cadena coincide con la expresión regular
    return regex.test(cadena);
}

export function formatearNumeroDinero(cadena) {
    return formatearNumeroConComas(truncarDecimal(cadena))
}

export function formatearNumeroConComas(cadena) {
    // Convertimos la cadena a un número flotante
    let numero = parseFloat(cadena);
    
    
    // Aseguramos que el número sea válido
    if (isNaN(numero)) {
        throw new Error("La cadena proporcionada no es un número válido.");
    }

    // Usamos toLocaleString para formatear el número con comas
    return numero.toLocaleString('en-US', { maximumFractionDigits: 20 });
}

export function truncarDecimal(numero) {
    // Convertimos el número a una cadena con máximo 4 decimales usando toFixed
    let cadena = numero.toFixed(2);
    // Convertimos la cadena de nuevo a un número para eliminar ceros innecesarios
    return parseFloat(cadena);
}

export function quitarTildes(cadena) {
    return cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

const validateApi = {

    everything: (input) => true,

    cedula: (input) => /^(\d{0,3})(-\d{0,6})?(-\d{0,4})?([A-Z]?)$/.test(input),

    numeric: (input) => {
        if(input == '') return true
        return /^\d{1,15}$/.test(input)
    },

    name: (input) => /^[^\~\`\!@\#\$\%\^\&\*\(\)_\+=\-\/\*\-\+\.\/\{\}\\\<\>\:\'\|]*$/.test(input),

    positiveReal: (input) => {
        if (input == '-' || input == '.' || input == '0') return true;
        if (input == '') return true;
        return /^(0|([1-9]\d*))(\.\d*)?$/.test(input);
    },

    priceTruncated: (input) => {
        if (input == '') return true
        return /^(?:0|[1-9]\d{0,})(?:\.\d{0,2})?$/.test(input)
    },

    measureTruncated: (input) => {
        if (input == '') return true
        return /^(?:0|[1-9]\d{0,})(?:\.\d{0,4})?$/.test(input)
    },

    number: (input) => {
        if (input == '') return true
        return /^(|[1-9]\d*)$/.test(input)
    },

    positiveIntegerOrZero: (input) => {
        if (input == '') return true
        return /^[0-9]+$/.test(input)
    },

    decimalPositiveOrZero: (input) => {
        if (input == '') return true
        return /^\d*\.?\d*$/.test(input)
    },

    name2: (input) => {
        if (input == '') return true
        return /^[a-zA-ZÀ-ÿ\s]+$/.test(input)
    },

    alfanumericCode: (input) => {
        if (input == '') return true
        return /^[a-zA-Z0-9]+$/.test(input)
    },

    date: (input) => {
        if (input == '') return true
        return /^\d{4}-\d{2}-\d{2}$/.test(input)
    },

    email: (input) => {
        if (input == '') return true
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input)
    },

    phone: (input) => {
        if (input == '') return true
        return /^\+?[0-9\s\-]+$/.test(input)
    },

    phoneLength: (input) => {
        if (input == '') return true
        return /^\d{8}$/.test(input)
    },

    postal: (input) => {
        if (input == '') return true
        return /^[0-9]{5}(?:-[0-9]{4})?$/.test(input)
    }, 
}

export default validateApi