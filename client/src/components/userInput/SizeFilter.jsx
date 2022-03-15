
import * as React from 'react';
import { display } from '@mui/system';
import {ToggleButton, TextField, CheckBox} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Style } from '@mui/icons-material';

export default function SizeFilter() {

    const [getToggle, setToggle] = React.useState(true);

    return (
        <div>
        <h3>Filter on group size?</h3>
        <ToggleButton
            value="check"
            onChange={() => {
            setToggle(!getToggle);
            console.log(getToggle)
            
        }}>
        <CheckIcon />
      </ToggleButton>


    <TextField

        disabled = {getToggle}
        label="Group size"
        type={'number'}
        defaultValue
        inputProps={{ 'data-testid': 'age-input' }}
        margin="normal"
        sx={{ width: 200 }}
    />
    </div>
    );
};