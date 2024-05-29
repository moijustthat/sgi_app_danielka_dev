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