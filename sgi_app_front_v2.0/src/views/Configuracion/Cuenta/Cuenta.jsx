import React from "react";
import { Grid } from "@mui/joy";
import "./Cuenta.css";
import { Divider } from "@mui/joy";
import BasicTabs from "../../../Components/BasicTabs/BasicTabs";
import icons from "../../../Icons/IconLibrary";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/joy";
import Perfil from "./Perfil/Perfil";
import MisDatos from "./MisDatos/MisDatos";
import CambiarPassword from "./CambiarPassword/CambiarPassword";

const Cuenta = () => {
  return (
    <Grid container spacing={3}>
      <Grid items xs={12}>
        <Paper elevation={0}>
          <Typography
            level="body-lg"
            endDecorator={icons.accountConfig}
            justifyContent="left"
            sx={{
              padding: 2
            }}
          >
           Configuracion de su cuenta
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={0}>
          <BasicTabs 
            sx={{
              marginLeft: '20px',
              marginRight: '20px'
            }}
            features={[
              {
                label: 'Perfil',
                component: <Perfil/>,
                icon: icons.accountTwoColor
              },
              {
                label: 'Mis datos',
                component: <MisDatos/>,
                icon: icons.personalDetails
              },
              {
                label: 'Cambiar contraseña',
                component: <CambiarPassword/>,
                icon: icons.password
              }
            ]}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Cuenta;
