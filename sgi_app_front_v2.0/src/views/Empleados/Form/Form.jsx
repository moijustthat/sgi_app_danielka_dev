import * as React from 'react';
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
import DatePicker from '../../../Components/DatePicker/DatePicker';

export default function CreditCardForm() {
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
      <Typography level="title-lg" >
        Empleado
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
          <FormLabel>Nombre</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Apellidos</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Direccion</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Departamento</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Cedula</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Correo</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Telefono fijo</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Telefono movil</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Fecha de nacimiento</FormLabel>
          <DatePicker/>
        </FormControl>
        <FormControl>
          <FormLabel>Fecha de alta</FormLabel>
          <DatePicker/>
        </FormControl>
        <FormControl>
          <FormLabel>Cargo</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Horario</FormLabel>
          <Input />
        </FormControl>
      </CardContent>
    </Card>
  );
}
