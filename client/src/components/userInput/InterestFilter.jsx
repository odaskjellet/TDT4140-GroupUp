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

const interests = [
  'Astrology',
  'Chess',
  'Gaming',
  'Skiing',
  'Traveling',
  'Sports',
  'Food',
  'Wine',
  'Movies',
  'Paragliding',
];

export default function FilterOnInterest() {
  const [interest, setInterest] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setInterest(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
      console.log({value})
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 200 }}>
        <InputLabel id="demo-multiple-checkbox-label">Interests</InputLabel>
        <Select
          labelId="interest-checkbox-label"
          id="interest-checkbox"
          multiple
          value={interest}
          onChange={handleChange}
          input={<OutlinedInput label="Interests" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {interests.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={interest.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}