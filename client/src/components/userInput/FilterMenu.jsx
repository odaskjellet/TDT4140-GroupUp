import React, {useEffect} from 'react';
import {
  Card,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
  Stack,
} from '@mui/material';
import classes from './FilterMenu.module.css';

/**
 * returns a filter used to find certain groups based on input.
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function FilterMenu(props) {
  const [locations, setLocations] = React.useState([]);
  const [interests, setInterests] = React.useState([]);
  const [size, setSize] = React.useState([1, 50]);
  const [age, setAge] = React.useState([18, 99]);
  const [locationOptions, setLocationOptions] = React.useState([]);
  const [interestOptions, setInterestOptions] = React.useState([]);

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

  useEffect(async () => {
    await fetchLocations();
    await fetchInterests();
    fetchFilteredGroups();
  }, [locations, interests, size, age]);

  const updateAgeRange = (e, data) => {
    setAge(data);
  };

  const updateSizeRange = (e, data) => {
    setSize(data);
  };

  const handleInterestChange = (event) => {
    const {
      target: {value},
    } = event;
    setInterests(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleLocationChange = (event) => {
    const {
      target: {value},
    } = event;
    setLocations(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const fetchLocations = async () => {
    fetch('/api/locations')
        .then((res) => res.json())
        .then((result) => setLocationOptions(result));
  };

  const fetchInterests = async () => {
    fetch('/api/interests')
        .then((res) => res.json())
        .then((result) => setInterestOptions(result));
  };

  const fetchFilteredGroups = async () => {
    fetch('/api/filter-groups', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        interests: interests,
        locations: locations,
        ageRange: age,
        sizeRange: size,
      }),
    }).then((res) => res.json())
        .then((result) => {
          props.filterCallback(result);
        });
  };

  if (locationOptions.length === 0) {
    return <div>Loading..</div>;
  } else {
    return (
      <div className={classes.FilterMenu}>
        <Card>

          {/* Interests */}

          <FormControl sx={{m: 1, width: 200}}>
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

          <FormControl sx={{m: 1, width: 200}}>
            <InputLabel id="location-checkbox-label">Locations</InputLabel>
            <Select
              labelId="location-checkbox-label"
              id="location-checkbox"
              multiple
              value={locations}
              onChange={handleLocationChange}
              input={<OutlinedInput label="Locations" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {locationOptions.map((location) => (
                <MenuItem key={location} value={location}>
                  <Checkbox checked={locations.indexOf(location) > -1} />
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
              sx={{width: 150}}
            />
          </Stack>

          {/* Group size */}

          <h3>Group size</h3>
          <Stack alignItems="center">
            <Slider
              onChangeCommitted={updateSizeRange}
              value={size}
              step={1}
              min={1}
              max={50}
              valueLabelDisplay="on"
              sx={{width: 150}}
            />
          </Stack>
        </Card>
      </div>
    );
  }
}

export default FilterMenu;
