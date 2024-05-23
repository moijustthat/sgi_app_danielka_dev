import React from "react";
import { useStateContext } from "../../../../Contexts/ContextProvider";
import "./ProfileInfo.css";
import { IconInfo } from "../Icons/Icons";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

const UserInfo = () => {
  const { getUser } = useStateContext();
  const user = getUser();

  return (
    <>
      {/* Iconos con información del usuario */}
      {/* Nombre, apellido y cargo del usuario */}
      <div className="infoContainer">
        <div className="infoContent">
          <img
            src={user.img}
            alt={`Usuario: ${user.nombre}`}
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
            icon={<LocalPhoneIcon />}
            nombreInfo="Telefono"
            userInfo={user.email}
          />
        </div>
      </div>
    </>
  );
};

export default UserInfo;
