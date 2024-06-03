import * as React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';

export default function CheckBoxTable({
    state,
    setState
}) {


    const handleChange = (event) => {
        const index = event.target.name;
        setState(prev => {
            const copy = [...prev];
            copy[index].check = !!!copy[index].check;
            return copy;
        });
    };

    // Divide the state into three columns
    const divideIntoColumns = (array, numColumns) => {
        const perColumn = Math.ceil(array.length / numColumns);
        const columns = [];
        for (let i = 0; i < numColumns; i++) {
            columns.push(array.slice(i * perColumn, (i + 1) * perColumn));
        }
        return columns;
    };

    const columns = divideIntoColumns(state, 3);

    return (
        <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ m: 3, flex: 1 }} component="fieldset" variant="standard">
                <FormLabel component="legend">Assign responsibility</FormLabel>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {columns.map((column, colIndex) => (
                        <FormGroup key={colIndex} sx={{ flex: 1, mx: 4 }}> {/* Increased horizontal margin */}
                            {column.map((permision, index) => (
                                <FormControlLabel
                                    key={index}
                                    control={
                                        <Checkbox checked={permision.check} onChange={handleChange} name={index.toString()} />
                                    }
                                    label={permision.nombre}
                                    sx={{ my: 1 }} // Increased vertical margin
                                />
                            ))}
                        </FormGroup>
                    ))}
                </Box>
                <FormHelperText>Be careful</FormHelperText>
            </FormControl>
        </Box>
    );
}
