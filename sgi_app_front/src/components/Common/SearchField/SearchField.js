import React from 'react';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchIcon from '@mui/icons-material/Search';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    borderRadius: '10px', // Hace que el borde sea ovalado
    '& .MuiOutlinedInput-root': {
    borderRadius: '10px', // También aplica el borde ovalado al input
    width: '80%',
    height: '8vh',
    fontSize: '1rem', // Tamaño del texto dentro del campo
    padding: theme.spacing(1, 2), // Espaciado interno del campo
  },
}));

const SearchField = ({setSearchText}) => {
  return (
    <StyledFormControl variant="outlined">
      <OutlinedInput
        onChange={(e) => setSearchText(e.target.value)}
        sx={{
            backgroundColor: '#F8FAFC'
        }}
        placeholder="Buscar"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
    </StyledFormControl>
  );
};

export default SearchField;
