import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Icon, IconButton, FormGroup, FormControlLabel } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';


export default function CheckMenu(props) {

    const {
        icon,
        columns,
        setColumns
    } = props

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
        <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
        >
            {icon}
        </IconButton>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={(e)=>e.stopPropagation()}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
        >
            <FormGroup>
                {columns.map(({label, checked}) => {
                if (label === 'id') return
                return  <FormControlLabel 
                            label={label}
                            control={
                                <Checkbox
                                    checked={checked}
                                    size='small'
                                    key={label}
                                    name={label}
                                    onChange={(e)=> {
                                        e.stopPropagation()
                                        const column = columns.findIndex(column=> column.label === e.target.name)
                                        const copyColumns = columns.slice()
                                        copyColumns[column] = {...copyColumns[column], checked: !!!copyColumns[column].checked}
                                        setColumns(copyColumns)
                                    }}
                                />
                            }
                        />
                        
                    
                })}
            </FormGroup>
        </Menu>
        </div>
    );
}
