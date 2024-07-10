import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const data = [
  { date: '2024-01-01', value: 200 },
  { date: '2024-01-02', value: 550 },
  { date: '2024-01-03', value: 200 },
  { date: '2024-01-05', value: 850 },
  { date: '2024-01-08', value: 150 },
  { date: '2024-01-10', value: 500 },
];

export default function Ventas() {
  return (
    <LineChart
      xAxis={[
        {
          data: data.map(d => new Date(d.date)),
          label: 'Fechas',
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'MMM DD, YYYY',
          },
        },
      ]}
      yAxis={[
        {
          label: 'Valores (C$)',
          valueFormatter: (value) => `C$ ${value.toFixed(2)}`,
        },
      ]}
      series={[
        {
          data: data.map(d => d.value),
          label: 'Valores Monetarios',
        },
      ]}
      width={500}
      height={300}
    />
  );
}