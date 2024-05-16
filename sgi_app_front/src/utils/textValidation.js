const validateApi = {
    name: (input) => {
        return /^[^\~\`\!@\#\$\%\^\&\*\(\)_\+=\-\/\*\-\+\.\/\{\}\\\<\>\:\'\|]*$/.test(input)
    },

    positiveReal: (input) => {
        if (input == '-') return false;
        if (input == '') return true
        if (input == '0') return false;
        return /^(?:(?:0\.\d*[1-9]\d*|[1-9]\d*(?:\.\d*)?)|\.\d*[1-9]\d*|null|\b)$/.test(input)
    }
}

export default validateApi