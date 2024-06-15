import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as Components from "./LoginComponents";
import InputValidator from "../Validators/InputValidator";
import validateApi from "../Validators/textValidation";
import axiosClient from "../api/axiosClient";
import { useStateContext } from "../Contexts/ContextProvider";

const Login = () => {
  const [signIn, toggle] = React.useState(true);

  const nombreRef = useRef()
  const apellidoRef = useRef()
  const usuarioRef = useRef()
  const correoRef = useRef()
  const telefonoRef = useRef()
  const passwordRef = useRef()

  const {setUser, setToken} = useStateContext()

  const navigate = useNavigate();

  const onSubmit = (e) => {

    const payload = {
      nombre: nombreRef.current.value,
      apellido: apellidoRef.current.value,
      usuario: usuarioRef.current.value,
      correo: correoRef.current.value,
      telefono: telefonoRef.current.value,
      password: passwordRef.current.value
    }
    axiosClient.post('/signup', payload)
      .then(({data})=>{
        setUser(data.user)
        setToken(data.token)
      })
      .catch(err => {
        const response = err.response
        if (response && response.status === 422) {
          console.log(response.data.errors)
        }
      })
  }

  return (
    <Components.Container>
      <Components.SignUpContainer signinIn={signIn}>
        <Components.Form>
          <Components.Title>Crea tu cuenta</Components.Title>
          <Components.inlineData>
          <InputValidator>
            <Components.HalfInput ref={nombreRef} type="text" placeholder="Nombre" />
          </InputValidator>
          <InputValidator>
            <Components.HalfInput ref={apellidoRef} type="text" placeholder="Apellido" />          
          </InputValidator>
          </Components.inlineData>
          <Components.inlineData>
            <InputValidator>
              <Components.HalfInput ref={usuarioRef} type="text" placeholder="Nombre de usuario" />            
            </InputValidator>
            <InputValidator 
              onValidationError={(input)=>!!!validateApi.email(input)}
              errorMessage="Formato incorrecto"
              >
              <Components.HalfInput ref={correoRef} type="text" placeholder="Correo" />          
            </InputValidator>
          </Components.inlineData>
          <Components.inlineData>
            <InputValidator
              restrictions={
                [
                  {
                    onRestriction: (input)=> !!!validateApi.number(input),
                    message: 'Solo digitos'
                  },
                  {
                    onRestriction: (input)=>validateApi.phoneLength(input),
                    message: 'Maximo: 8 digitos'
                  }
                ]
              }
              onValidationError={(input)=>!!!validateApi.phone(input)}
              errorMessage="Formato incorrecto"
            >
              <Components.HalfInput ref={telefonoRef} type="text" placeholder="Telefono" />          
            </InputValidator>
            <InputValidator>
              <Components.HalfInputPassword ref={passwordRef} type="text" placeholder="Contraseña"/>          
            </InputValidator>
          </Components.inlineData>
          <Components.Button onClick={(e)=>{
            e.preventDefault()
            onSubmit(e)
          }}>Registrarse</Components.Button>
        </Components.Form>
      </Components.SignUpContainer>

      <Components.SignInContainer signinIn={signIn}>
        <Components.Form>
          <Components.Title>Tus credenciales</Components.Title>
          <Components.Input type="text" placeholder="Nombre de usuario, correo o telefono" />
          <Components.Input type="password" placeholder="Contraseña" />
          <Components.Anchor href="#">Olvido su contraseña?</Components.Anchor>
          <Components.Button onClick={(e)=>{
            e.preventDefault();
            alert('login')
          }}>Ingresar</Components.Button>
        </Components.Form>
      </Components.SignInContainer>

      <Components.OverlayContainer signinIn={signIn}>
        <Components.Overlay signinIn={signIn}>
          <Components.LeftOverlayPanel signinIn={signIn}>
            <Components.Title>Ya estas con nosotros?</Components.Title>
            <Components.Paragraph>
              Ingresa tus credenciales para ingresar al sistema
            </Components.Paragraph>
            <Components.GhostButton onClick={() => {
              navigate("/login")
              toggle(true)
            }}>
              Ingresar
            </Components.GhostButton>
          </Components.LeftOverlayPanel>

          <Components.RightOverlayPanel signinIn={signIn}>
            <Components.Title>Hola, eres nuevo miembro del personal?</Components.Title>
            <Components.Paragraph>
              Ingresa tus datos personales para comenzar a trabajar con nosotros
            </Components.Paragraph>
            <Components.GhostButton onClick={() => {
             navigate("/signup")
              toggle(false)
            }}>
              Registrarse
            </Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
};

export default Login;
