import React, { useState, useEffect } from 'react';
import axiosClient from '../../../axios-client'
import Grid from '@mui/material/Grid';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import { TextField, Button, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useStateContext } from '../../../Contexts/ContextProvider'
import MovimientoDialog from './Movimiento/MovimientoDialog'

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Ventas = () => {
  const [data, setData] = useState({
    labels: [], // Fechas
    datasets: [
      {
        label: 'Ventas',
        data: [], // Valores monetarios
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  });

  useEffect(() => {

    axiosClient.get('/ventas/chart')
      .then(({data})=>{
        const fechas = data.ventas.map(venta => venta['Fecha emision'])
        const valores = data.ventas.map(venta => venta['Pagado'])
        setData({
          labels: fechas,
          datasets: [
            {
            label: 'Ventas',
            data: valores,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            },
          ],
        });
      })
      .catch(error=>{
        console.log(error)
      })

  }, []);

  return <Line data={data} />;
};

const Compras = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Compras',
        data: [],
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
      },
    ],
  });

  useEffect(() => {

    axiosClient.get('/ordenes/chart')
      .then(({data})=>{
        const fechas = data.ordenes.map(orden => orden['Fecha emision'])
        const valores = data.ordenes.map(orden => orden['Pagado'])
        setData({
          labels: fechas,
          datasets: [
            {
              label: 'Compras',
              data: valores,
              borderColor: 'rgba(255,99,132,1)',
              backgroundColor: 'rgba(255,99,132,0.2)',
            },
          ],
        });
      })
      .catch(error=>{
        console.log(error)
      })
  }, []);

  return <Line data={data} />;
};

const TotalGanado = ({ ventas, compras }) => {
  
  const [total, setTotal] = useState(null)

  axiosClient.get('/total')
  .then(({data})=>{ 
    setTotal(Number(data.total).toFixed(2));
  })
  .catch(error=>{
    console.log(error)
  })

  return (
    <>
      <Typography level="h1">Total</Typography>
      <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
        Ganancias totales en la empresa
      </Typography>
      <Typography>
        C$ {total}
      </Typography>
    </>
  );
};

const ProductosMasVendidos = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Productos más vendidos',
        data: [],
        backgroundColor: 'rgba(54,162,235,0.2)',
        borderColor: 'rgba(54,162,235,1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    axiosClient.get('/productos/top')
      .then(({data})=>{
        const producto = data.data 
        console.log(producto)
        const labels = producto.map(p=>p.nombre)
        const cantidad = producto.map(p=>p.cantidad)
        setData({
          labels: labels,
          datasets: [
            {
              label: "Productos más vendidos",
              data: cantidad,
              backgroundColor: "rgba(54,162,235,0.2)",
              borderColor: "rgba(54,162,235,1)",
              borderWidth: 1,
            },
          ],
        }); 
      })
     .catch(error=>{
      console.log(error);
     })
  }, []);

  return <Bar data={data} />;
};

const Arqueo = ({setOpen}) => {
  const [cantidad, setCantidad] = useState('');
  const [mensaje, setMensaje] = useState('');

  const { getUser, setToken } = useStateContext()
  const user = getUser()

  const handleChange = (event) => {
    setCantidad(event.target.value);
  };

  const handleIngresar = () => {
    axiosClient.post('/caja/ingresar', {monto: Number(cantidad), empleadoId: user.usuarioId})
      .then(({data})=>{
        console.log(data);
        setMensaje(data.data);
      })
      .catch(error=>{
        console.log(error);
      })
  };

  const handleExtraer = async () => {
    axiosClient.post('/caja/extraer', {monto: Number(cantidad), empleadoId: user.usuarioId})
      .then(({data})=>{
        console.log(data);
        setMensaje(data.data);
      })
      .catch(error=>{
        console.log(error);
      })
  };

  const handleReporte = () => {
    setCantidad('');
    setMensaje('');
    setOpen(true)
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Arqueo de Caja
      </Typography>
      <TextField
        label="Cantidad"
        type="number"
        value={cantidad}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleIngresar}
        >
          Ingresar
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleExtraer}
        >
          Extraer
        </Button>
        <Button
          variant="contained"
          onClick={handleReporte}
        >
          Ver reporte
        </Button>
      </Box>
      {mensaje && (
        <Typography variant="body1" color="textSecondary" mt={2}>
          {mensaje}
        </Typography>
      )}
    </Box>
  );
};

const Inicio = () => {
  const ventasData = [200, 300, 250];
  const comprasData = [150, 250, 200];
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (<>
    <MovimientoDialog open={open} onClose={handleClose} />
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h1>Inicio</h1>
      </Grid>
      <Grid item xs={4}>
        <Card sx={{ height: '200px' }}>
          <Ventas />
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card sx={{ height: '200px' }}>
          <Compras />
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card sx={{ height: '200px' }}>
          <TotalGanado ventas={ventasData} compras={comprasData} />
        </Card>
      </Grid>
      <Grid item xs={8}>
        <Card sx={{ height: '300px' }}>
          <ProductosMasVendidos />
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card sx={{ height: '300px' }}>
          <Arqueo setOpen={setOpen}/>
        </Card>
      </Grid>
    </Grid>
    </>
  );
};

export default Inicio;
