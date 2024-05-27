import { debounce } from 'lodash';

export function myConcat(arr1, arr2) {
    let concatenated = []
    for (let e1 of arr1) {
      concatenated.push(e1)
    }
    for (let e2 of arr2) {
      concatenated.push(e2)
    }
    return concatenated
}

export const handleConditionalCostValidation = (value, validation, ifValid, ifNotValid) => {
    if (validation(value)) ifValid()
    else ifNotValid()
  }

export const handleFoundCostValidation = debounce((matrix, constraint, value, ifFound, ifNotFound)=>{
    let found = matrix.find(item=> {
        if (item.hasOwnProperty('info')) item = item.info
        return String(item[constraint]).replace(/\s+/g, '').toUpperCase() === value.replace(/\s+/g, '').toUpperCase()
    })
    if (found) {
      ifFound()
    } else {
        ifNotFound()
    }
  }, 300)

 export const handleDoubleCostValidation = debounce((constraint1, constraint2, validation, setRollbacks) => {
    if (validation(constraint1.value, constraint2.value)) {
      setRollbacks(rollbacks=>{
        return {
          ...rollbacks,
        [constraint1.label]: true,
        [constraint2.label]: true
        }
      })
    } else {
      setRollbacks(rollbacks=>{
        return {
          ...rollbacks,
        [constraint1.label]: false,
        [constraint2.label]: false
        }
      })
    }
  }, 300)

