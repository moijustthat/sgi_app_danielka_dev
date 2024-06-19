import React from "react";
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
import icons from "../../../../Icons/IconLibrary";


const CambiarPassword = () => {
  return (
    <Card
      variant="outlined"
      sx={{
        maxHeight: "max-content",
        maxWidth: "100%",
        marginTop: "20px",
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
          <FormLabel>Contraseña actual</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
        </FormControl>
        <FormControl>
          <FormLabel>Nueva contraseña</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Confirmar nueva contraseña</FormLabel>
          <Input />
        </FormControl>
        <CardActions>
          <Button variant="solid" sx={{ background: "#37A0F4" }}>
            Actualizar contraseña
          </Button>
          <Button variant="outlined" sx={{ borderColor: "#F44336", color:"#757575" }}>
            Borrar
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default CambiarPassword;
