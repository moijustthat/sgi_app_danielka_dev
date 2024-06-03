import React, { useState } from "react";
import "./FormPassword.css";

import { useStateContext } from "../../../../Contexts/ContextProvider";
import axiosClient from "../../../../axios-client";

import validateApi from "../../../../utils/textValidation";
import { Avatar } from "@mui/material";
import { base64ToHex } from "../../../../utils/HexToDataUrl";

export const FormPassword = () => {

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const { getUser } = useStateContext()
  const user = getUser()

  const onChangePassword = (e) => {
    e.preventDefault()
    if (confirmNewPassword !== newPassword) alert('Confirmacion de nueva contraseña no coincide')
    else {
      const payload = { userId: user.usuarioId, currentPassword: currentPassword, newPassword: newPassword }
      axiosClient.post('/changePassword', payload)
        .then(({ data }) => {
          alert(data.data)
        })
        .catch(error => {
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
              onChange={(e) => {
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
              onChange={(e) => {
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
              onChange={(e) => {
                const input = e.target.value
                setConfirmNewPassword(input)
              }}
            />
          </div>

          <div className="formGroup">
            <button onClick={(e) => onChangePassword(e)} type="submit" className="btn-submit" id="submitPass">
              Guardar Contraseña
            </button>
          </div>
        </form>
      </div>


    </>
  );
};


export const FormData = () => {

  const { getUser } = useStateContext();
  const user = getUser();

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [img, setImg] = useState('')

  const onChangeData = (e) => {
    e.preventDefault()

    if (nombre===''&&correo===''&&img==='') {
      alert('Debes llenar al menos un campo para actualizar tus datos')
      return
    } else if (!!!validateApi.email(correo)) {
      alert('Formato de correo incorrecto. Vuelve a intentarlo')
      return
    } else {
      const payload = {userId: user.usuarioId, nombre: nombre, correo: correo, img: img !== '' ? img : ''}
      axiosClient.post('/changeData', payload)
        .then(({data})=>{
          alert('Datos cambiados con exito')
          console.log(data.data)
        })
        .catch(error=>{
          console.log(error)
        })
    }
  }
  console.log(img)
  return (
    <>
      <div className="formContainer">
        <form className="fornmulario Datos">
          <h2 className="titleForm">Cambiar Datos Personales</h2>
          <div className="formGroup">
            <label htmlFor="NuevoNombre">Cambiar Nombre</label>
            <input
              value={nombre}
              type="text"
              id="NuevoNombre"
              placeholder="Ingresa tu Nombre"
              onChange={(e) => {
                const input = e.target.value
                if (validateApi.name(input)) {
                  setNombre(input)
                }
              }}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="NuevoCorreo">Cambiar Correo</label>
            <input
              value={correo}
              type="text"
              id="NuevoCorreo"
              placeholder="Ingresa tu correo"
              onChange={(e) => {
                const input = e.target.value
                if (validateApi.everything(input)) {
                  setCorreo(input)
                }
              }}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="profile-picture">Cambiar Foto de perfil <Avatar src={img!==''? img : user.img}/></label>
            <input 
              
              type="file"
              id="profile-picture"
              className="file-input"
              onChange={(e) => {
                const input = e.target.files[0]

                // Validar tipos permitidos en la imagen
                if (input.type !== 'image/avif' && input.type !== 'image/png' && input.type !== 'image/jpeg') return
                const file = input // Esta es la  ruta de la imagen
                const reader = new FileReader()

                reader.onloadend = () => {
                  setImg(reader.result)
                }

                reader.readAsDataURL(file)

              }}
            />
            <label htmlFor="profile-picture" className="custom-file-upload">
              Elegir archivo
            </label>
          </div>
          <div className="formGroup">
            <button onClick={(e)=> onChangeData(e)} type="submit" className="btn-submit" id="submitData">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </>
  )
}


