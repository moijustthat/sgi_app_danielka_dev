import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ width: '100%' }}> 
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{ textAlign: 'left' }} // Aplicar estilos directamente al BottomNavigation
      >
        <BottomNavigationAction label="Recents" sx={{ textAlign: 'left' }} /> {/* Aplicar estilos directamente al BottomNavigationAction */}
      </BottomNavigation>
    </Box>
  );
}
