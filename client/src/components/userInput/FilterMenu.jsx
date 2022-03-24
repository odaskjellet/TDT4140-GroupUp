import React, {useEffect, useState} from 'react';
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
 * Filters stuff
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function FilterMenu(props) {
  const [locations, setLocations] = useState([]);
  const [interests, setInterests] = useState([]);
  const [size, setSize] = useState([1, 50]);
  const [age, setAge] = useState([18, 99]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [interestOptions, setInterestOptions] = useState([]);

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
  }, [locations, interests]);

  const updateAgeRange = (e, data) => {
    setAge(data);
    fetchFilteredGroups();
  };

  const updateSizeRange = (e, data) => {
    setSize(data);
    fetchFilteredGroups();
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

  const ageMarks = [
    {value: 18, label: '18'},
    {value: 40, label: '40'},
    {value: 60, label: '60'},
    {value: 80, label: '80'},
    {value: 99, label: '99'},
  ];

  const sizeMarks = [
    {value: 1, label: '1'},
    {value: 10, label: '10'},
    {value: 20, label: '20'},
    {value: 30, label: '30'},
    {value: 40, label: '40'},
    {value: 50, label: '50'},
  ];

  return (
    <div className={classes.FilterMenu}>
      <Card style={{padding: '1rem'}}>

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
            onChange={(e, data) => {
              setAge(data);
            }}
            onChangeCommitted={updateAgeRange}
            value={age}
            step={1}
            min={18}
            max={99}
            marks={ageMarks}
            valueLabelDisplay="auto"
            sx={{width: 150}}
          />
        </Stack>

        {/* Group size */}

        <h3>Group size</h3>
        <Stack alignItems="center">
          <Slider
            onChange={(e, data) => {
              setSize(data);
            }}
            onChangeCommitted={updateSizeRange}
            value={size}
            step={1}
            min={1}
            max={50}
            marks={sizeMarks}
            valueLabelDisplay="auto"
            sx={{width: 150}}
          />
        </Stack>
      </Card>
    </div>
  );
}

export default FilterMenu;
