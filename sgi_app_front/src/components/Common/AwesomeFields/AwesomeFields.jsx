import React, { useState, useCallback } from "react"
import { Alert } from "@mui/material"
import { debounce } from "lodash"

export const DateField = ({incomplete=false, desactiveManually=false, value='', blocked=false, label, onChange=() => null}) => {

    const [err, setErr] = useState('')
    const [warning, setWarning] = useState('')
    return (
      <div className='customDate'>
        <label>{label}</label>
        <input className={incomplete ? 'markAsIncomplete' : ''} value={value} onChange={(e) => onChange(e.target.value, setErr, setWarning)} id='dateField' type='date' disabled={blocked}></input>
        <Alert 
          sx={{
            display: err == '' ? 'none' : ''
          }} severity="error">{err}</Alert>
        <Alert 
          sx={{
            display: warning == '' || desactiveManually ? 'none' : ''
          }} severity="warning">{warning}</Alert>
      </div>
    )
  }
  
 export const SelectField = ({incomplete='', value='', blocked=false, label='', onChange=() => null, options=[]}) => {
    return (
      <div className='customSelect'>
        <label>{label}*</label>
        <select className={incomplete !== '' ? 'markAsIncomplete' : ''} value={value} onChange={(e) => onChange(e.target.value, ()=>true)}>
          <option disabled selected value='empty'>Seleccionar</option>
          {options.map(option => (
            <option key={option.label} value={option.value}>{option.label}</option>
          ))}
        </select>
        <span className='customArrow'></span>
      </div>
    )
  }
  
  
 export const ImgField = ({label, blocked=false, placeholder, onChange, incomplete=null}) => {
  
    const [err, setErr] = useState('')
    const [warning, setWarning] = useState('')

    return (
      <div className='textField'>
        <label>{label}*</label>
        <input
          className={incomplete ? 'markAsIncomplete' : ''}
          type="file"
          onChange={(e) => {
            onChange(e.target.files[0], setErr, setWarning)
          }} 
          placeholder={incomplete ? `Rellena el campo ${incomplete}` : placeholder}/>
          <Alert 
          sx={{
            display: warning == '' ? 'none' : ''
          }} severity="warning">{warning}</Alert>
          <Alert 
          sx={{
            display: err == '' ? 'none' : ''
          }} severity="error">{err}</Alert>
      </div>
    )
  }
  
 export const TextField = React.memo(({desactiveManually=false, value='', blocked=false, label='', placeholder='', onChange=()=>null, incomplete=null}) => {
  
    const [err, setErr] = useState('')
    const [warning, setWarning] = useState('')

    const debouncedOnChange = useCallback(
      debounce((value, setErr, setWarning)=> {
        onChange(value, setErr, setWarning)
      }, 5),
      [onChange]
    )

    return (
      <div className='textField'>
        <label>{label}*</label>
        <input
          className={incomplete ? 'markAsIncomplete' : ''}
          value={value}
          disabled={false}
          onChange={(e) => onChange(e.target.value, setErr, setWarning)}
          type="text" 
          placeholder={incomplete ? `Rellena el campo ${incomplete}` : placeholder}/>
          <Alert 
          onClose={()=>setErr('')}
          sx={{
            display: err == '' ? 'none' : ''
          }} severity="error">{err}</Alert>
          <Alert 
          sx={{
            display: warning == '' || desactiveManually ? 'none' : ''
          }} severity="warning">{warning}</Alert>
      </div>
    )
  })
  
 export const TextArea = React.memo(({value='', blocked=false, label, placeholder, onChange=()=>null, incomplete=null}) => {
  
    const [err, setErr] = useState('')
    const [warning, setWarning] = useState('')
    const debouncedOnChange = useCallback(
      debounce((value, setErr, setWarning)=> {
        onChange(value, setErr, setWarning)
      }, 5),
      [onChange]
    )

    return (
      <div className='textField'>
        <label>{label}*</label>
        <textarea className={incomplete ? 'markAsIncomplete' : ''} 
        value={value} 
        onChange={(e) => onChange(e.target.value, setErr, setWarning)} placeholder={incomplete ? `Rellena el campo ${incomplete}` : placeholder} rows={4} cols={50}></textarea>
        <Alert 
          onClose={()=>setErr('')}
          sx={{
            display: err == '' ? 'none' : ''
          }} severity="error">{err}</Alert>
      </div>
    )
  })