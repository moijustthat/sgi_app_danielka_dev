import React from 'react'
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';

const Banner = ({children}) => {
  return (
    <Paper 
      elevation={0} 
      square={false}
      sx={{
        width: '96.7%',
        paddingLeft: '1.5%',
        borderRadius: '16px',
        paddingTop: '1.5%',
        paddingBottom: '1.5%',
        marginBottom: '1.5%',
        height: '6.5vh'
        }}
    >
      <Typography
        sx={{
            fontFamily: 'Inter',
            fontWeight: 'Bold',
            fontSize: '120%'
            }}
          >
         {children}
      </Typography>
      
    </Paper>
  )
}

export default Banner