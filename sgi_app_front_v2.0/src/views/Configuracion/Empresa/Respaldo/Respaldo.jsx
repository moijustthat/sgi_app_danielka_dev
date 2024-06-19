import * as React from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import { styled } from "@mui/joy/styles";
import icons from "../../../../Icons/IconLibrary";
import AspectRatio from "@mui/joy/AspectRatio";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import { Divider } from "@mui/joy";

const {
  backupOutlined
} = icons

const Item = styled(Sheet)(({ theme }) => ({
  ...theme.typography["body-sm"],
  textAlign: "center",
  fontWeight: theme.fontWeight.md,
  color: theme.vars.palette.text.secondary,
  border: "1px solid",
  borderColor: theme.palette.divider,
  padding: theme.spacing(1),
  borderRadius: theme.radius.md,
  flexGrow: 1,
}));

export default function Respaldo() {
  return (
    <Card>
        <Typography level="title-lg" startDecorator={backupOutlined}>
          Respaldo para el sistema
        </Typography>
        <Divider inset="none" />
      <Stack
        sx={{marginTop: '10px'}}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Item sx={{
            background: '#EEF2F6',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: '#FFE57F',
            },
        }}>
        <div
            className="wrapperIconQuadrant"
          >
            <div className="iconQuadrant">{icons.database}</div>
            <h3>Realizar Copia de seguridad</h3>
        </div>
        </Item>
        <Item  sx={{
            background: '#EEF2F6',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: '#FFE57F',
            },
        }}>
        <div
            className="wrapperIconQuadrant"
          >
            <div className="iconQuadrant">{icons.restore}</div>
            <h3>Restaurar copia de seguridad</h3>
        </div>
        </Item>
      </Stack>
    </Card>
  );
}
