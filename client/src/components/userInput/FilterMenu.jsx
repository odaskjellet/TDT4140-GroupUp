import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/User';
import { useContext } from 'react';
import { Card, InputLabel, MenuItem, Select, TextField, FormControl, Stack, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import classes from './FilterMenu.module.css';
import NestedListItems from '../../components/userInput/NestedListItems';
import InterestFilter from './InterestFilter';
import LocationFilter from './LocationFilter';
import AgeFilter from './AgeFilter';
import SizeFilter from './SizeFilter';

function FilterMenu() {
    return (
        <div className={classes.FilterMenu}>
            <Card>
            <InterestFilter />
            <LocationFilter />
            <h3>Filter on age</h3>
            <AgeFilter />
            <SizeFilter />

            </Card>
        </div>

    )
}

export default FilterMenu;