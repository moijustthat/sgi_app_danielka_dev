import React from "react";
import icons from "../../../../Icons/IconLibrary";
import * as Form from "../../../../Components/Form/Form";
import '../../../../Styles/Quadrant.css'
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';



const { 
  store,
  navigation,
  phone,
  email
 } = icons;



const Info = () => {
  return (
    <Card
    variant="outlined"
    sx={{
      maxHeight: 'max-content',
      maxWidth: '100%',
      mx: 'auto',
      // to make the demo resizable
      overflow: 'auto',
      resize: 'horizontal',
    }}
  >
    <Typography level="title-lg" startDecorator={store}>
      Datos de su empresa
    </Typography>
    <Divider inset="none" />
    <CardContent
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
        gap: 1.5,
      }}
    >
      <FormControl>
        <FormLabel>Razon social</FormLabel>
        <Input/>
      </FormControl>
      <FormControl>
        <FormLabel>Numero RUC</FormLabel>
        <Input/>
      </FormControl>
      <FormControl  sx={{ gridColumn: '1/-1' }}>
        <FormLabel>Direccion</FormLabel>
        <Input endDecorator={navigation} />
      </FormControl>
      <FormControl>
        <FormLabel>Departamento</FormLabel>
        <Input/>
      </FormControl>
      <FormControl>
        <FormLabel>Municipio</FormLabel>
        <Input/>
      </FormControl>
      <FormControl>
        <FormLabel>Telefono</FormLabel>
        <Input endDecorator={phone} />
      </FormControl>
      <FormControl>
        <FormLabel>Correo</FormLabel>
        <Input endDecorator={email} />
      </FormControl>
      <CardActions sx={{ gridColumn: '1/-1' }}>
        <Button variant="solid" sx={{background: "#37A0F4"}}>
          Actualizar datos de la empresa
        </Button>
      </CardActions>
    </CardContent>
  </Card>   
  );
};

export default Info;
