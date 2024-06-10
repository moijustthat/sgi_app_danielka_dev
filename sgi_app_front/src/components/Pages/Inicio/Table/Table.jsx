import React, {useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Table.css';
import axiosClient from '../../../../axios-client'
import { CircularProgress } from '@mui/material';
import CardView from '../../../Common/CardViews/CardView'

function createData(producto, num_orden, cantidad, precio, proveedor, estado) {
  return { producto, num_orden, cantidad, precio, proveedor, estado};
}

export default function BasicTable() {

    const [loading, setLoading] = useState(false)
    const [ordenes, setOrdenes] = useState([])

    const getOrdenesRecientes = () => {
        setLoading(true)
        axiosClient.get('/ordenes/recientes')
            .then(({data})=>{
                const ordenesRes =  data.ordenes
                const rows = []
                for (let orden of ordenesRes) {
                    rows.push(createData(orden['Producto'], orden['#Num'], orden['Cantidad'], orden['Precio'], orden['Proveedor'], orden['Estado entrega']))
                }
                setOrdenes(rows)
                setLoading(false)
            })
            .catch((error) => {
                console.error(error)
                setLoading(false)
            })
    }

    const makeStyle = (estado) => {
        if (estado === 'Recibida') {
            return {
                background: 'green'
            }
        } else if(estado === 'Esperando') {
            return {
                background: 'yellow'
            }
        }
    }

    useEffect(() => {
        getOrdenesRecientes()
    }, [])

    if (loading) return
    else {

        return (
        <div className='Table'>
            <h3>Ordenes Recientes</h3>
            <div className="table-container">
                <TableContainer component={Paper} style={{
                    maxHeight: '300px',
                    overflowY: 'scroll',
                 }}>
                    <Table sx={{ minWidth: 650}} aria-label="fixed size table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell align="left">Num Orden</TableCell>
                                <TableCell align="left">Cantidad</TableCell>
                                <TableCell align="left">Precio</TableCell>
                                <TableCell align="left">Proveedor</TableCell>
                                <TableCell align="left">Estado entrega</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ordenes.map((orden, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="orden">
                                        {orden.producto}
                                    </TableCell>
                                    <TableCell align="left">{orden.num_orden}</TableCell>
                                    <TableCell align="left">{orden.cantidad}</TableCell>
                                    <TableCell align="left">{orden.precio}</TableCell>
                                    <TableCell align="left">{orden.proveedor}</TableCell>
                                    <TableCell align="left">
                                        <span className='status' style={makeStyle(orden.estado)}>{orden.estado}</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {ordenes.length === 0 ? <CardView type='shopping' style={{
                                        marginTop: "2.5%",
                                        marginLeft: "35%",
                                        width: '30%',
                                        height: '200px'
                                    }} /> : null}
                </TableContainer>
            </div>
        </div>
        );
    }
}
