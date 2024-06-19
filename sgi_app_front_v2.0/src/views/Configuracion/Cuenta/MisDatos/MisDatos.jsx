import React from "react";
import icons from "../../../../Icons/IconLibrary";
import * as Form from "../../../../Components/Form/Form";
import "../../../../Styles/Quadrant.css";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardContent from "@mui/joy/CardContent";
import Checkbox from "@mui/joy/Checkbox";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import { Grid } from "@mui/joy";
import "./MisDatos.css";
const { store, navigation, phone, email } = icons;

const MisDatos = () => {
  return (
    <Grid container spacing={2} className="MisDatosContainer">
      <Grid item xs={6}>
        <Card
          variant="outlined"
          sx={{
            maxHeight: "max-content",
            maxWidth: "100%",
            mx: "auto",
            // to make the demo resizable
            overflow: "auto",
            resize: "horizontal",
          }}
        >
          <Typography level="title-lg" startDecorator={icons.personalData}>
            Informacion personal
          </Typography>
          <Divider inset="none" />
          <CardContent
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(80px, 1fr))",
              gap: 1.5,
            }}
          >
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input />
            </FormControl>
            <FormControl>
              <FormLabel>Apellidos</FormLabel>
              <Input />
            </FormControl>
            <FormControl>
              <FormLabel>Nombre de usuario</FormLabel>
              <Input />
            </FormControl>
            <FormControl>
              <FormLabel>Fecha de nacimiento</FormLabel>
              <Input />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>Bio</FormLabel>
              <Input endDecorator={icons.aboutMe} />
            </FormControl>
            <CardActions sx={{ gridColumn: "1/-1" }}>
              <Button variant="solid" sx={{ background: "#37A0F4" }}>
                Actualizar informacion personal
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card
          variant="outlined"
          sx={{
            maxHeight: "max-content",
            maxWidth: "100%",
            mx: "auto",
            // to make the demo resizable
            overflow: "auto",
            resize: "horizontal",
          }}
        >
          <Typography level="title-lg" startDecorator={icons.contactInfo}>
            Informacion de contacto
          </Typography>
          <Divider inset="none" />
          <CardContent
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(80px, 1fr))",
              gap: 1.5,
            }}
          >
            <FormControl>
              <FormLabel>Telefono movil</FormLabel>
              <Input />
            </FormControl>
            <FormControl>
              <FormLabel>Telefono fijo</FormLabel>
              <Input />
            </FormControl>
            <FormControl>
              <FormLabel>Correo</FormLabel>
              <Input />
            </FormControl>
            <FormControl>
              <FormLabel>Direccion</FormLabel>
              <Input endDecorator={navigation} />
            </FormControl>
            <FormControl>
              <FormLabel>Departamento</FormLabel>
              <Input />
            </FormControl>
            <FormControl>
              <FormLabel>Municipio</FormLabel>
              <Input />
            </FormControl>
            <CardActions sx={{ gridColumn: "1/-1" }}>
              <Button variant="outlined" sx={{ borderBlockColor: "#37A0F4" }}>
                Actualizar informacion de contacto
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MisDatos;
