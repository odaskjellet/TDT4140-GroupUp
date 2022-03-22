import React from 'react';
import { Card, InputLabel, MenuItem, Select, TextField, FormControl, Stack, Checkbox, OutlinedInput, ListItemText, Slider, ToggleButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import classes from './FilterMenu.module.css';

function FilterMenu() {
  const [locationName, setLocationName] = React.useState([]);
  const [interests, setInterests] = React.useState([]);
  const [getToggle, setToggle] = React.useState(true);
  const [size, setSize] = React.useState(1);
  const [age, setAge] = React.useState([18, 99])
  
  const locations = [ // Should get from server
    'Oslo',
    'Trondheim'
  ];

  const interestOptions = [ // Should get from server
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
  

  const updateAgeRange = (e, data) => {
      setAge(data);
      fetchFilteredGroups()
  }

  const handleInterestChange = (event) => {
    const {
      target: { value },
    } = event;
    setInterests(
      typeof value === 'string' ? value.split(',') : value,
      console.log({value})
    );
    fetchFilteredGroups()
  };

  const handleLocationChange = (event) => {
    const {
      target: { value },
    } = event;
    setLocationName(
      typeof value === 'string' ? value.split(',') : value,
      console.log({value})
    );
    fetchFilteredGroups()
  };
  
  const fetchFilteredGroups = async () => {
      fetch('/api/filter-groups', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interest: interests[0],
            location: locationName,
            ageLow: age[0],
            ageHigh: age[1],
            size: size
          }),
      }).then((res) => res.json())
      .then((result) => {
        console.log(result);
      })
    };


  return (
      <div className={classes.FilterMenu}>
        <Card>

          {/* Interests */}
          
          <FormControl sx={{ m: 1, width: 200 }}>
            <InputLabel id="interest-checkbox-label">Interests</InputLabel>
            <Select
            labelId="interest-checkbox-label"
            id="interest-checkbox"
            multiple
            value={interests}
            onChange={handleInterestChange}
            input={<OutlinedInput label="Interests" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
            >
            {interestOptions.map((name) => (
                <MenuItem key={name} value={name}>
                <Checkbox checked={interests.indexOf(name) > -1} />
                <ListItemText primary={name} />
                </MenuItem>
            ))}
            </Select>
          </FormControl>
          
          {/* Location */}

          <FormControl sx={{ m: 1, width: 200 }}>
            <InputLabel id="location-checkbox-label">Locations</InputLabel>
            <Select
            labelId="location-checkbox-label"
            id="location-checkbox"
            multiple
            value={locationName}
            onChange={handleLocationChange}
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
          
          {/* Age */}

          <h3>Filter on age</h3>
           <Stack alignItems="center">
            <Slider
                onChangeCommitted={updateAgeRange}
                value={age}
                step={1}
                min={18}
                max={99}
                valueLabelDisplay="on"
                sx={{ width: 150 }}
            />
          </Stack>
          
          {/* Group size */}

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
                        setSize({value: parseInt(value)})
                    }
                  }}                
                sx={{ width: 200}}
            ></TextField>
        </Card>
    </div>
  )
}

export default FilterMenu;