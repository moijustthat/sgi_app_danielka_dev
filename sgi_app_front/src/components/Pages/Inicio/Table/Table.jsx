import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Table.css';

function createData(producto, num_orden, cantidad, precio, proveedor, estado) {
  return { producto, num_orden, cantidad, precio, proveedor, estado};
}

const rows = [
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),
    createData('Taladro Electrico', '#23', 100, 43.3, 'Sinsa', 'Pendiente'),


];

export default function BasicTable() {

    const makeStyle = (estado) => {
        if (estado == 'Recibido') {
            return {
                background: 'green'
            }
        } else if(estado == 'Pendiente') {
            return {
                background: 'yellow'
            }
        }
    }

    return (
        <div className='Table'>
            <h3>Ordenes Recientes</h3>
            <div className="table-container">
                <TableContainer component={Paper} style={{maxHeight: 'calc(100vh - 275px)', overflowY: 'auto' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="fixed size table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell align="left">Num Orden</TableCell>
                                <TableCell align="left">Cantidad</TableCell>
                                <TableCell align="left">Precio</TableCell>
                                <TableCell align="left">Proveedor</TableCell>
                                <TableCell align="left">Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {row.producto}
                                    </TableCell>
                                    <TableCell align="left">{row.num_orden}</TableCell>
                                    <TableCell align="left">{row.cantidad}</TableCell>
                                    <TableCell align="left">{row.precio}</TableCell>
                                    <TableCell align="left">{row.proveedor}</TableCell>
                                    <TableCell align="left">
                                        <span className='status' style={makeStyle(row.estado)}>{row.estado}</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}
