import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MenuList } from '@mui/material';

import { UimCircle } from '@iconscout/react-unicons-monochrome'

import { Link } from 'react-router-dom';

import './SubMenu.css'

export default function SubMenu({children, options=[], onSelected}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div
        onClick={handleClick}
      >
        {children}
      </div>
      <Menu
        anchorOrigin={{
            vertical: 'top', // Alinea el menú verticalmente con el borde superior del botón
            horizontal: 'right', // Alinea el menú horizontalmente con el borde derecho del botón
        }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {options.map(option => {
            return <Link to={option.url} style={{all: 'unset'}}>
                        <MenuItem key={option.heading} onClick={() => {handleClose(); onSelected()}}>
                         <UimCircle className='dot'/>{option.heading}
                        </MenuItem>
                    </Link>
        })}
      </Menu>
    </div>
  );
}