import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { IconButton } from '@mui/material';
import { Grid } from '@mui/material';

export default function SimpleBottomNavigation({ actions, id }) {
  const [value, setValue] = React.useState(0);

  return (
    <Grid container spacing={4}>
        {actions.map(action=>{
            return <Grid item xs={1}>
                        <IconButton
                            onClick={(e)=>{
                                e.stopPropagation()
                                action.action(id)
                            }}
                        >
                            {action.icon}
                        </IconButton>
                    </Grid>
        })}
        
    </Grid>
  );
}
