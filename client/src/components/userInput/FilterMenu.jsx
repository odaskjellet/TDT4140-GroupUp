import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/User';
import { useContext } from 'react';
import { Card, InputLabel, MenuItem, Select, TextField, FormControl, Stack, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import classes from './FilterMenu.module.css';
import NestedListItems from '../../components/userInput/NestedListItems';

function FilterMenu() {
    return (
        <div className={classes.FilterMenu}>

            {/* <Stack
                direction="row"
                justifyContent="center"
                alignItems="baseline"
                spacing={1}
                id='filterMenu'
            >
            <h1>Test!!!</h1>
            </Stack> */}
            <Card>
            <NestedListItems />
                <h1>Filtermenu</h1>
                <h2>Interests</h2>
                <FormGroup>
                    <FormControlLabel control={<Checkbox />} label="Ski"></FormControlLabel>    
                </FormGroup>
                <h2>Location</h2>
                
            </Card>
        </div>

    )
}

export default FilterMenu;