import { useState } from "react"
import { Alert } from "@mui/material"

export const DateField = ({value='', blocked=false, label, onChange=() => null}) => {

    const [err, setErr] = useState('')
    const [warning, setWarning] = useState('')
    return (
      <div className='customDate'>
        <label>{label}</label>
        <Alert 
          onClose={()=>setErr('')}
          sx={{
            display: err == '' ? 'none' : ''
          }} severity="error">{err}</Alert>
        <Alert 
          sx={{
            display: warning == '' ? 'none' : ''
          }} severity="warning">{warning}</Alert>
        <input value={value} onChange={(e) => onChange(e.target.value, setErr, setWarning)} id='dateField' type='date' disabled={blocked}></input>
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
  
    return (
      <div className='textField'>
        <label>{label}*</label>
        <Alert 
          sx={{
            display: err == '' ? 'none' : ''
          }} severity="error">{err}</Alert>
        <input
          className={incomplete ? 'markAsIncomplete' : ''}
          type="file"
          onChange={(e) => {
            onChange(e.target.files[0], setErr)
          }} 
         
          placeholder={incomplete ? `Rellena el campo ${incomplete}` : placeholder}/>
      </div>
    )
  }
  
 export const TextField = ({value='', blocked=false, label='', placeholder='', onChange=()=>null, incomplete=null}) => {
  
    const [err, setErr] = useState('')
    const [warning, setWarning] = useState('')
    return (
      <div className='textField'>
        <label>{label}*</label>
        <Alert 
          onClose={()=>setErr('')}
          sx={{
            display: err == '' ? 'none' : ''
          }} severity="error">{err}</Alert>
          <Alert 
          sx={{
            display: warning == '' ? 'none' : ''
          }} severity="warning">{warning}</Alert>
        <input
          className={incomplete ? 'markAsIncomplete' : ''}
          value={value}
          disabled={false}
          onChange={(e) => {
            onChange(e.target.value, setErr, setWarning)
          }} 
          type="text" 
          placeholder={incomplete ? `Rellena el campo ${incomplete}` : placeholder}/>
      </div>
    )
  }
  
 export const TextArea = ({value='', blocked=false, label, placeholder, onChange=()=>null, incomplete=null}) => {
  
    const [err, setErr] = useState('')
  
    return (
      <div className='textField'>
        <label>{label}*</label>
        <Alert 
          onClose={()=>setErr('')}
          sx={{
            display: err == '' ? 'none' : ''
          }} severity="error">{err}</Alert>
        <textarea className={incomplete ? 'markAsIncomplete' : ''} value={value} onChange={(e) => onChange(e.target.value, setErr)} placeholder={incomplete ? `Rellena el campo ${incomplete}` : placeholder} rows={4} cols={50}></textarea>
      </div>
    )
  }