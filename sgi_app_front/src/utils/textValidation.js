const validateApi = {

    everything: (input) => true,

    numeric: (input) => {
        if(input == '') return true
        return /^\d{1,15}$/.test(input)
    },

    name: (input) => /^[^\~\`\!@\#\$\%\^\&\*\(\)_\+=\-\/\*\-\+\.\/\{\}\\\<\>\:\'\|]*$/.test(input),

    positiveReal: (input) => {
        if (input == '-') return false;
        if (input == '') return true
        if (input == '0') return false;
        return /^(?:(?:0\\d*[1-9]\d*|[1-9]\d*(?:\.\d*)?)|\.\d*[1-9]\d*|null|\b)$/.test(input)
    },

    priceTruncated: (input) => {
        if (input == '') return true
        return /^(?:0|[1-9]\d{0,})(?:\.\d{0,2})?$/.test(input)
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
        return /^[0-9]+(\.[0-9]+)?$/.test(input)
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

    postal: (input) => {
        if (input == '') return true
        return /^[0-9]{5}(?:-[0-9]{4})?$/.test(input)
    }, 
}

export default validateApi