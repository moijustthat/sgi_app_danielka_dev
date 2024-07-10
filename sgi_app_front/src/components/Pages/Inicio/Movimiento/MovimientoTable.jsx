import React, { useState } from 'react';
import { Button, Card } from '@mui/material';
import MovimientoDialog from './MovimientoDialog';

const MovimientoTable = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card sx={{ height: '300px', padding: 2 }}>
      <Button variant="contained" onClick={handleOpen}>
        Ver Informe de Movimientos
      </Button>
      <MovimientoDialog open={open} onClose={handleClose} />
    </Card>
  );
};

export default MovimientoTable;
