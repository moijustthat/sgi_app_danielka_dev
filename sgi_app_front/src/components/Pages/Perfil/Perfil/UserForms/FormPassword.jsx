import React from "react";
import "./FormPassword.css";
export const FormPassword = () => {
  return (
    <>
      <div className="formContainer">
        <form className="formularioPass">
          <h2 className="titleForm">Cambiar Contraseña</h2>
          <div className="formGroup">
            <label htmlFor="current-password">Contraseña Actual</label>
            <input
              type="password"
              id="current-password"
              placeholder="********"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="new-password">Contraseña Nueva</label>
            <input type="password" id="new-password" placeholder="********" />
          </div>

          <div className="formGroup">
            <label htmlFor="confirm-password">Confirmar Contraseña</label>
            <input type="password" id="confirm-password" placeholder="********" />
          </div>

          <div className="formGroup">
            <button type="submit" className="btn-submit" id="submitPass">
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


