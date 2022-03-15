import * as React from 'react';
import Slider from '@mui/material/Slider'
import { display } from '@mui/system';

export default function AgeFilter() {
    const [val, setVal]=React.useState([18,99])
    const updateRange=(e,data) => {
        setVal(data);
    }

    const handleChange = (event, newValue) => {
        console.log(oldValue);   
    }
    return (
        <Slider
            onChangeCommitted={updateRange}
            value={val}
            step={1}
            min={18}
            max={99}
            valueLabelDisplay="on"
            sx={{ width: 150 }}
        />
    );
};
