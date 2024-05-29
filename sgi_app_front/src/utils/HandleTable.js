export const cleanTable = (table) => {
    const cleanedTable = []
    if (table.length > 0) {
        const columns = Object.keys(table[0])
        for (let row of table) {
            let cleanedRow = {}
            for (let column of columns) {
                if (row[column] === '' || !row[column]) cleanedRow[column] = '-'
                else cleanedRow[column] = row[column]  
            }
            cleanedTable.push(cleanedRow)
        }
    }
    return cleanedTable
}

export const formatColumnsTable = (table, format) => {
    const formatedTable = []
    const currentColumns = Object.keys(format)
    for (let row of table) {
        let formatedRow = {}
        for (let currentColumn of currentColumns) {
            formatedRow[format[currentColumn]] = row[currentColumn]
        }    
        formatedTable.push(formatedRow)
    }
    return formatedTable
}

export const filterColumns = (table, columns) => {
    const filteredTable = []
    if (table.length > 0) {
        const currentColumns = Object.keys(table[0])
        for (let row of table) {
            let filteredRow = {}
            for (let currentColumn of currentColumns) {
                if (!columns.find(col=>col===currentColumn)) {
                    filteredRow[currentColumn] = row[currentColumn]
                }
            }
            filteredTable.push(filteredRow)
        }
    }
    return filteredTable
}