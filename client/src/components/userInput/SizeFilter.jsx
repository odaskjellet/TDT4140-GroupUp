
import * as React from 'react';
import { color, display } from '@mui/system';
import { ToggleButton, TextField, CheckBox, Button} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Style } from '@mui/icons-material';
import {useForm} from 'react-hook-form';


export default function SizeFilter() {

    const [getToggle, setToggle] = React.useState(true);
    const [value, setValue] = React.useState(1);

    const onSubmit = async (option, data) => {
        if (!getToggle) {
            console.log(data);
            //setBadLogin(false);
            fetch('/api/filter-groups', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify('groupSize', data),
            }).then((res) => {
                if (res.ok) {
                    console.log("OK!");
                    //userDispatch({type: 'login', username: data.username});
                    //navigate('../home');
                } else {
                    //setBadLogin(true);
                    console.log("Feil!");
                    console.log(res);
                }
            });
        }

    };
    
    return (
        <div>
            <h3>Filter on group size?</h3>
            <ToggleButton
                value="check"
                onChange={() => {
                    setToggle(!getToggle);
                    console.log(getToggle);
                }}>
                <CheckIcon />
            </ToggleButton>

            <TextField

                disabled={getToggle}
                label="Group size"
                type={'number'}
                inputProps={{ 'data-size': 'size-input' }}
                onChange={(e) => {
                    const { value } = e.target;
                    if (value.match('.')) {
                        setValue({value: parseInt(value)})
                    }
                    console.log({value});
                    onSubmit("groupSize",{value});
                  }}                
                sx={{ width: 200}}
                ></TextField>
        </div>
    );
};