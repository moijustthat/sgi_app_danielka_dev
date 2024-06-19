import React from "react";
import "./Empresa.css";
import { Grid } from "@mui/joy";
import Info from "./Info/Info";
import Logo from './Logo/Logo';
import Respaldo from "./Respaldo/Respaldo";
import Retiradas from "./Retiradas/Retiradas";
const Empresa = () => {
  return (
    <Grid container spacing={2} className="containerEmpresa">
      <Grid item xs={6} className="wrapperInfoEmpresa">
        <Info />
      </Grid>
      <Grid item xs={6} className="wrapperLogoEmpresa">
        <Logo />
      </Grid>
      <Grid item xs={6} className="wrapperRetiroDeCaja">
        <Retiradas />
      </Grid>
      <Grid item xs={6} className="wrapperRespaldoBdEmpresa">
        <Respaldo />
      </Grid>
    </Grid>
  );
};

export default Empresa;
