import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/User';
import { useContext } from 'react';
import { Card, InputLabel, MenuItem, Select, TextField, FormControl, Stack, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import classes from './FilterMenu.module.css';
import NestedListItems from '../../components/userInput/NestedListItems';
import UseSelectFilter from '../../components/userInput/UseSelectFilter';


function FilterMenu() {
    return (
        <div className={classes.FilterMenu}>
            <Card>
            <UseSelectFilter />
            </Card>
        </div>

    )
}

export default FilterMenu;