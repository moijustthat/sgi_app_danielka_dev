import React, { useEffect, useState } from "react";
import "./DigitalClock.css"; // Importa el archivo CSS con los estilos

const formatTime = (val) => {
  return val < 10 ? "0" + val : val;
};

const DigitalClock = ({ sx }) => {
  const [time, setTime] = useState({
    hour: "",
    minute: "",
    second: "",
		day: "",
    ampm: "",
  });

  const tick = () => {
		const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
    const date = new Date();
    let hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
		const day = date.getDay();
    let ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12; // En caso de que sea 0, mostrar 12 en lugar de 0

    setTime({
      hour: formatTime(hour),
      minute: formatTime(minute),
      second: formatTime(second),
			day: dias[day],
      ampm: ampm,
    });
  };

  useEffect(() => {
    const timeID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timeID);
    };
  }, []);

  return (
    <div style={sx} class="clock-container">
      <div class="clock-col">
        <p class="clock-timer">{time.day}</p>
      </div>
      <div class="clock-col">
        <p class="clock-timer">{time.hour}</p>
      </div>
      <div class="clock-col">
        <p class="clock-timer">{time.minute}</p>
      </div>
      <div class="clock-col">
        <p class="clock-timer">{time.second}</p>
      </div>
			<div class="clock-col">
        <p class="clock-timer">{time.ampm}</p>
      </div>
    </div>
  );
};

export default DigitalClock;
