import React, { useRef } from "react";
import Avatar from "@mui/joy/Avatar";
import AvatarGroup from "@mui/joy/AvatarGroup";
import { AspectRatio } from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardActions from "@mui/joy/CardActions";
import IconButton from "@mui/joy/IconButton";
import {Divider} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import icons from "../../../../Icons/IconLibrary";
import noImage from "../../../../images/noimage.jpg";

const {
  image
} = icons

export default function BottomActionsCard() {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      // Puedes agregar aquí el código para manejar el archivo seleccionado
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: "100%",
        // to make the card resizable
        overflow: "auto",
        resize: "horizontal",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography level="title-lg" startDecorator={image}>
          Logotipo para sus facturas
        </Typography>
        <Divider inset="none" />
      </Box>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <img width={350} height={280} src={noImage} loading="lazy" alt="" />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            marginLeft: "15px",
          }}
        >
          <Button
            sx={{ height: "50%", marginBottom: "20px" }}
            variant="outlined"
            color="neutral"
          >
            Quitar imagen
          </Button>
          <Button
            onClick={handleButtonClick}
            sx={{ 
              height: "50%", 
              background: "#F66B62",
              transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: '#F44336',
            },
            }}
            variant="solid"
          >
            Añadir imagen
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </Box>
    </Card>
  );
}
