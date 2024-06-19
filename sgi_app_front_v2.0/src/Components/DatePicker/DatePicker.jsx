import { useState } from "react";
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

export default function BasicDatePicker() {
  const [value, onChange] = useState(new Date());

  return (
   
      <DatePicker onChange={onChange} value={value} />
    
  );
}
