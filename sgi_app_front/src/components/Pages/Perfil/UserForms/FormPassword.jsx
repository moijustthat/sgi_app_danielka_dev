import React, { useState } from "react";
import "./FormPassword.css";

import { useStateContext } from "../../../../Contexts/ContextProvider";
import axiosClient from "../../../../axios-client";

export const FormPassword = () => {

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  
  const {getUser} = useStateContext()
  const user = getUser()

  const onChangePassword = (e) => {
      e.preventDefault()
      if (confirmNewPassword !== newPassword) alert('Confirmacion de nueva contraseña no coincide')
      else {
        const payload = {userId: user.usuarioId, currentPassword: currentPassword, newPassword: newPassword}
        axiosClient.post('/changePassword', payload)
          .then(({data})=>{
            alert(data.data)
          })
          .catch(error=>{
            console.log(error)
            alert('Password incorrecta')
          })
      }
  }

  return (
    <>
      <div className="formContainer">
        <form className="formularioPass">
          <h2 className="titleForm">Cambiar Contraseña</h2>
          <div className="formGroup">
            <label htmlFor="current-password">Contraseña Actual</label>
            <input
              value={currentPassword}
              type="password"
              id="current-password"
              placeholder="********"
              onChange={(e)=>{
                const input = e.target.value
                setCurrentPassword(input)
              }}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="new-password">Contraseña Nueva</label>
            <input 
              value={newPassword}
              type="password" 
              id="new-password" 
              placeholder="********"
              onChange={(e)=> {
                const input = e.target.value
                setNewPassword(input)
              }}
              />
          </div>

          <div className="formGroup">
            <label htmlFor="confirm-password">Confirmar Contraseña</label>
            <input 
              value={confirmNewPassword}
              type="password" 
              id="confirm-password" 
              placeholder="********" 
              onChange={(e)=> {
                const input = e.target.value
                setConfirmNewPassword(input)
              }}
            />
          </div>

          <div className="formGroup">
            <button onClick={(e)=>onChangePassword(e)} type="submit" className="btn-submit" id="submitPass">
              Guardar Contraseña
            </button>
          </div>
        </form>
      </div>

   
    </>
  );
};


 export const FormData = () => {
  return (
    <>
           <div className="formContainer">
        <form className="fornmulario Datos">
          <h2 className="titleForm">Cambiar Datos Personales</h2>
          <div className="formGroup">
            <label htmlFor="NuevoNombre">Cambiar Nombre</label>
            <input
              type="text"
              id="NuevoNombre"
              placeholder="Ingresa tu Nombre"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="NuevoCorreo">Cambiar Correo</label>
            <input
              type="text"
              id="NuevoCorreo"
              placeholder="Ingresa tu correo"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="profile-picture">Cambiar Foto de perfil</label>
            <input type="file" id="profile-picture" className="file-input" />
            <label htmlFor="profile-picture" className="custom-file-upload">
              Elegir archivo
            </label>
          </div>
          <div className="formGroup">
            <button type="submit" className="btn-submit" id="submitData">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </>
  )
}


