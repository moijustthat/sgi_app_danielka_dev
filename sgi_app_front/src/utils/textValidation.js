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

    number: (input) => {
        if (input == '') return true
        return /^(?:(?:0\.\d*[1-9]\d*|[1-9]\d*(?:\.\d*)?)|\.\d*[1-9]\d*|null|\b)$/.test(input)
    }
}

export default validateApi