export const deleteFromList = (setList, cantidad, key) => {
    if (cantidad > 0) {
        setList(prev=>{
            const index = prev.findIndex(p=>String(p.id)===String(key))
            const copyPrev = [...prev.slice(0, index), ...prev.slice(index+1)]
            return copyPrev
        })
    }
}

export const addOnList = (setList, cantidad, label, key, limit=null) => {
    if (cantidad > 0) {
        setList(prev=>{
            const copyPrev = [...prev]
            const index = prev.findIndex(p=>String(p.id)===String(key))
            const item = {...prev[index]}
            if (Number(item[label]) >= Number(limit)) return prev
            item[label]++
            copyPrev[index] = item
            return copyPrev
        })
    }
}

export const restOnList = (setList, cantidad, label, key) => {
    if (cantidad > 0) {
        setList(prev=>{
            const copyPrev = [...prev]
            const index = prev.findIndex(p=>String(p.id)===String(key))
            const item = {...prev[index]}
            item[label] > 1 && item[label]--
            copyPrev[index] = item
            return copyPrev
        })
    }
}