import React, {useState} from "react";
import { useStateContext } from "../../../../Contexts/ContextProvider";
import "./ProfileInfo.css";
import { IconInfo } from "../Icons/Icons";
import EmailIcon from "@mui/icons-material/Email";
import { FaBabyCarriage } from "react-icons/fa";
import { Avatar } from "@mui/material";
import logo from '../../../../imgs/noimg.avif'
import { calcularEdad } from "../../../../utils/DatesHelper";

const UserInfo = () => {
  const { getUser } = useStateContext();
  const user = getUser();



  console.log(user)
  return (
    <>
      {/* Iconos con información del usuario */}
      {/* Nombre, apellido y cargo del usuario */}
      <div className="infoContainer">
        <div className="infoContent">
          <img
            src={!!!user.img || user.img === '' || user.img === 'data:image/jpeg;base64,'? logo : user.img}
            className="avatarPerfil"
          />{" "}
          {/*Image usuario*/}
          <div className="infoPerfil">
            <h3>{`${user.nombre} ${user.apellido}`}</h3> {/*Nombre y apellido*/}
            <p>{user.apellido}</p>{" "}
            {/*Cuando este el cargo del usuario en la bd cambias aqui*/}
          </div>
        </div>

        <div className="infoPerfil">
          <IconInfo
            icon={<EmailIcon />}
            nombreInfo="Correo"
            userInfo={user.email}
          />
          <IconInfo
            icon={<FaBabyCarriage />}
            nombreInfo="Edad"
            userInfo={calcularEdad(user.fechaNacimiento)}
          />
        </div>
      </div>
    </>
  );
};

export default UserInfo;
