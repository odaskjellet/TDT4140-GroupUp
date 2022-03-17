/* OBS: REIN KOPI! FOR TEST*/
import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};

const locations = [
  'Oslo',
  'Trondheim'
];

export default function FilterOnLocation() {
  const [locationName, setLocationName] = React.useState([]);

  const handleChange = async (option,data) => {
    //setBadLogin(false);
    fetch('/api/get-groups-at-location', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(option,data),
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
  };

/*   const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setLocationName(
      onSubmit(value,"location")
      // On autofill we get a stringified value.
      //typeof value === 'string' ? value.split(',') : value,
    );
  }; */

  return (
    <div>
      <FormControl sx={{ m: 1, width: 200 }}>
        <InputLabel id="demo-multiple-checkbox-label">Locations</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={locationName}
          onChange={handleChange}
          input={<OutlinedInput label="Locations" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {locations.map((location) => (
            <MenuItem key={location} value={location}>
              <Checkbox checked={locationName.indexOf(location) > -1} />
              <ListItemText primary={location} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}