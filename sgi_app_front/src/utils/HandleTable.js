export const colorStates = (table) => {
    const coloredTable = []
    if (table.length > 0) {
        for (let row of table) {
            const coloredRow = { ...row }
            switch (row['Estado']) {
                case 'pendiente':
                    coloredRow['Estado'] = <div 
                    
                    onClick={(e)=>{
                        e.stopPropagation()
                        alert('Pendiente: '+row.id)
                    }}

                    style={{
                        textAlign: 'center',
                        background: '#F1C418',
                        color: '#FFF',
                        fontFamily: 'Inter',
                        borderRadius: '5px',
                        padding: '5px 5px'
                    }}>{row['Estado']}</div>
                    break;
                case 'pagada':
                    coloredRow['Estado'] = <div 
                    onClick={(e)=>{
                        e.stopPropagation()
                        alert('Pagada: '+row.id)
                    }}
                    
                    style={{
                        textAlign: 'center',
                        background: '#4CBDA3',
                        color: '#FFF',
                        fontFamily: 'Inter',
                        borderRadius: '5px',
                        padding: '5px 5px'
                    }}>{row['Estado']}</div>
                    break;
                case 'cancelada':
                    coloredRow['Estado'] = <div 
                    onClick={(e)=>{
                        e.stopPropagation()
                        alert('Cancelada: '+row.id)
                    }}
                    
                    style={{
                        textAlign: 'center',
                        background: '#E54435',
                        color: '#FFF',
                        fontFamily: 'Inter',
                        borderRadius: '5px',
                        padding: '5px 5px'
                    }}>{row['Estado']}</div>
                    break;

            }
            coloredTable.push(coloredRow)
        }
    }
    return coloredTable
}

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
                if (!columns.find(col => col === currentColumn)) {
                    filteredRow[currentColumn] = row[currentColumn]
                }
            }
            filteredTable.push(filteredRow)
        }
    }
    return filteredTable
}