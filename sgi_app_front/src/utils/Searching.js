import { debounce } from 'lodash';

function myConcat(arr1, arr2) {
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

