import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import axiosClient from '../../../../axios-client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MovimientoDialog = ({ open, onClose }) => {
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    if (open) {
      // Fetch movimientos from the server
      axiosClient.get('/movimientos')
        .then(({ data }) => {
          setMovimientos(data.data);
        })
        .catch(error => {
          console.error("Error!", error);
        });
    }
  }, [open]);

  const handlePrintPDF = () => {
    const input = document.getElementById('movimiento-table');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('movimientos.pdf');
      });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Informe de Movimientos</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table id="movimiento-table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Empleado</TableCell>
                <TableCell>Tipo de Movimiento</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movimientos.map((movimiento) => (
                <TableRow key={movimiento.ID}>
                  <TableCell>{movimiento.ID}</TableCell>
                  <TableCell>C$ {movimiento.Monto}</TableCell>
                  <TableCell>{movimiento.Fecha}</TableCell>
                  <TableCell>{movimiento.Hora}</TableCell>
                  <TableCell>{movimiento.Empleado}</TableCell>
                  <TableCell>{movimiento.TipoMovimiento}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePrintPDF}>Imprimir PDF</Button>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MovimientoDialog;
