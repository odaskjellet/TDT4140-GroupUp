
import * as React from 'react';
import { display } from '@mui/system';
import { ToggleButton, TextField, CheckBox, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Style } from '@mui/icons-material';

export default function SizeFilter() {

    const [getToggle, setToggle] = React.useState(true);
    const [value, setValue] = React.useState('');

    const handleChange = async (option, data) => {
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
                    console.log(getToggle)

                }}>
                <CheckIcon />
            </ToggleButton>


            <TextField

                disabled={getToggle}
                label="Group size"
                type={'number'}
                value={value}
                onChange={(event) => { setValue(event.target.value) } // calling the handleChange function
                }
                inputProps={{ 'data-size': 'size-input' }}
                margin="normal"
                sx={{ width: 200 }}

            />
            <Button
            aria-label="Button"
            data-testid="size-button"
            variant="contained"
            type="submit"
            onChange={() => console.log(value)}
          >
            Submit size filter
          </Button>
        </div>
    );
};