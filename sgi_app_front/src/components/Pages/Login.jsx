import { useRef } from 'react'
import './Login.css'

import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

import { useStateContext } from '../../Contexts/ContextProvider'

import axiosClient from '../../axios-client';

const Login = () => {

  const emailRef = useRef()
  const passwordRef = useRef()
  const rememberRef = useRef()

  const { setUser, setToken } = useStateContext()

  const onSubmit = (e) => {
    e.preventDefault()
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value
    }

    axiosClient.post('/login', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token)
      })
      .catch (error => {
        const response = error.response
        console.log(response.data);
      })

  }

  return (
    
      <form className='formLogin' onSubmit={onSubmit}>
        <div className='wrapper'>
          <h1>Login</h1>
          <div className='input-box'>
            <input ref={emailRef} type='email' placeholder='Correo' required></input>
            <MdEmail className='icon'/>
          </div>

          <div className='input-box'>
            <input ref={passwordRef} type='password' placeholder='Clave' required></input>
            <RiLockPasswordFill className='icon'/>
          </div>

          <div className='remember-forgot'>
            <label><input ref={rememberRef} type='checkbox' />Recuerdame</label>
            <a href="#" style={{color: 'unset', background: 'unset', fontSize: 'unset'}}>Olvidaste tu clave?</a>
          </div>

          <button type='submit'>Iniciar Sesion</button>
        </div>
      </form>
    
  )
}

export default Login