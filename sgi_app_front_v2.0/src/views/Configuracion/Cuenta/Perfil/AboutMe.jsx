import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import icons from "../../../../Icons/IconLibrary";
import { Grid } from "@mui/joy";
import "./AboutMe.css";

export default function AboutMe() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 600px), 1fr))",
      }}
    >
      <Card size="lg" variant="outlined">
        <div
          style={{
            display: "flex",
          }}
        >
          <Typography level="h4">
            Sobre mi
          </Typography>
        </div>
        <Divider inset="none" />
        <Typography
          level="body-sm"
          sx={{
            textAlign: "left",
          }}
        >
          Hola, soy empleado x, puesto x, de la empresa x.
        </Typography>
        <Typography  level="body-sm" sx={{
                        textAlign: "left",
                        fontWeight:  550,
                        color: "#121926"
                    }}>
          Detalles personales
        </Typography>
        <List size="sm" sx={{ mx: "calc(-1 * var(--ListItem-paddingX))" }}>
          <ListItem>
            <ListItemDecorator> </ListItemDecorator>
            <Grid container spacing={2} className='inlineInfo'>
                <Grid item xs={6}>
                <Typography level="body-sm" sx={{
                        textAlign: "left",
                        fontWeight:  550,
                        color: "#121926"
                    }}>Nombre completo</Typography>
                </Grid>
                <Grid item xs={4}>:</Grid>
                <Grid item xs={2}>nombre</Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <ListItemDecorator> </ListItemDecorator>
          <Grid container spacing={2} className='inlineInfo'>
                <Grid item xs={6}>   
                <Typography level="body-sm" sx={{
                        textAlign: "left",
                        fontWeight:  550,
                        color: "#121926"
                    }}>Fecha de nacimiento</Typography>
                </Grid>
                <Grid item xs={4}>:</Grid>
                <Grid item xs={2}>nombre</Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <ListItemDecorator> </ListItemDecorator>
          <Grid container spacing={2} className='inlineInfo'>
                <Grid item xs={6}>
                    
                <Typography level="body-sm" sx={{
                        textAlign: "left",
                        fontWeight:  550,
                        color: "#121926"
                    }}>Direccion</Typography>
                </Grid>
                <Grid item xs={4}>:</Grid>
                <Grid item xs={2}>direccion</Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <ListItemDecorator> </ListItemDecorator>
          <Grid container spacing={2} className='inlineInfo'>
                <Grid item xs={6}>
                    
                <Typography level="body-sm" sx={{
                        textAlign: "left",
                        fontWeight:  550,
                        color: "#121926"
                    }}>Cedula</Typography>
                </Grid>
                <Grid item xs={4}>:</Grid>
                <Grid item xs={2}>cedula</Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <ListItemDecorator> </ListItemDecorator>
          <Grid container spacing={2} className='inlineInfo'>
                <Grid item xs={6}>
                    
                    <Typography level="body-sm" sx={{
                        textAlign: "left",
                        fontWeight:  550,
                        color: "#121926"
                    }}>Correo</Typography>
                    </Grid>
                <Grid item xs={4}>:</Grid>
                <Grid item xs={2}>correo@correo.com</Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <ListItemDecorator> </ListItemDecorator>
          <Grid container spacing={2} className='inlineInfo'>
                <Grid item xs={6}><Typography level="body-sm" sx={{
                        textAlign: "left",
                        fontWeight:  550,
                        color: "#121926"
                    }}>Telefono fijo</Typography></Grid>
                <Grid item xs={4}>:</Grid>
                <Grid item xs={2}>222222222</Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <ListItemDecorator> </ListItemDecorator>
          <Grid container spacing={2} className='inlineInfo'>
                <Grid item xs={6}>
                    
                    <Typography level="body-sm" sx={{
                        textAlign: "left",
                        fontWeight:  550,
                        color: "#121926"
                    }}>Telefono movil</Typography>
                </Grid>
                <Grid item xs={4}>:</Grid>
                <Grid item xs={2}>888888888</Grid>
            </Grid>
          </ListItem>
        </List>
      </Card>
    </Box>
  );
}
