import React, { useState } from "react";
import "./Empleados.css";
import { Grid } from "@mui/joy";
import Form from "./Form/Form";
import { Card, Sheet } from "@mui/joy";
import ListaEmpleados from "./Lista/Lista";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import icons from "../../Icons/IconLibrary";

const Empleados = () => {
  const [all, setAll] = useState(false);

  return (
    <Grid container spacing={1} className="EmpleadosWrapper">
      <Grid item xs={12} className="EmpleadosActions">
        <Box
          className="menuBtnsContainer"
          sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
        >
          <Button
            startDecorator={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
              </svg>
            }
            sx={{
              color: "#FFF",
              background: "#8262C2",
              borderLeft: "5px solid #6139B3",
              borderTop: "5px solid #6139B3",
              transition: "300ms ease all",
              "&:hover": {
                borderLeft: "5px solid #8262C2",
                borderTop: "5px solid #8262C2",
                background: "#8262C2",
                borderBottom: "5px solid #6139B3",
                borderRight: "5px solid #6139B3",
              },
            }}
            variant="solid"
          >
            Recuperar
          </Button>
          <Button
            startDecorator={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                <path d="M16 19h6" />
                <path d="M19 16v6" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
              </svg>
            }
            sx={{
              color: "#FFF",
              background: "#76D7A4",
              borderLeft: "5px solid #47A441",
              borderTop: "5px solid #47A441",
              transition: "300ms ease all",
              "&:hover": {
                borderLeft: "5px solid #76D7A4",
                borderTop: "5px solid #76D7A4",
                background: "#76D7A4",
                borderBottom: "5px solid #47A441",
                borderRight: "5px solid #47A441",
              },
            }}
            variant="solid"
          >
            Nuevo Empleado
          </Button>
          <Button
            startDecorator={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                <path d="M16 19h6" />
                <path d="M19 16v6" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
              </svg>
            }
            sx={{
              color: "#FFF",
              background: "#8fcbf7",
              borderLeft: "5px solid #218AE5",
              borderTop: "5px solid #218AE5",
              transition: "300ms ease all",
              "&:hover": {
                borderLeft: "5px solid #8fcbf7",
                borderTop: "5px solid #8fcbf7",
                background: "#8fcbf7",
                borderBottom: "5px solid #218AE5",
                borderRight: "5px solid #218AE5",
              },
            }}
            variant="solid"
          >
            Buscar
          </Button>
          <Button
            startDecorator={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-trash"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 7l16 0" />
                <path d="M10 11l0 6" />
                <path d="M14 11l0 6" />
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
              </svg>
            }
            sx={{
              color: "#FFF",
              background: "#F66B62",
              borderLeft: "5px solid #b3372c",
              borderTop: "5px solid #b3372c",
              transition: "300ms ease all",
              "&:hover": {
                borderLeft: "5px solid #F66B62",
                borderTop: "5px solid #F66B62",
                background: "#F66B62",
                borderBottom: "5px solid #b3372c",
                borderRight: "5px solid #b3372c",
              },
            }}
            variant="solid"
          >
            Eliminar
          </Button>
        </Box>
      </Grid>
      {all ? (
        "all"
      ) : (
        <>
          <Grid item xs={8} className="EmpleadosForm">
            <Form />
          </Grid>
          <Grid items xs={4} className="EmpleadosList">
            <Sheet
              invertedColors
              sx={{
                pt: 1,
                borderRadius: "sm",
                "--TableCell-height": "40px",
                // the number is the amount of the header rows.
                "--TableHeader-height": "calc(1 * var(--TableCell-height))",
                height: "100%",
                overflow: "auto",
                background: (theme) =>
                  `linear-gradient(${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
            linear-gradient(rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
            radial-gradient(
              farthest-side at 50% 0,
              rgba(0, 0, 0, 0.12),
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(
                farthest-side at 50% 100%,
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0)
              )
              0 100%`,
                backgroundSize: "100% 40px, 100% 40px, 100% 14px, 100% 14px",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "local, local, scroll, scroll",
                backgroundPosition:
                  "0 var(--TableHeader-height), 0 100%, 0 var(--TableHeader-height), 0 100%",
                backgroundColor: "background.surface",
              }}
            >
              <ListaEmpleados 
                onVerTodo={()=>setAll(true)}
              />
            </Sheet>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Empleados;
