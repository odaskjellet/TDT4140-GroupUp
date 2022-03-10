import React from 'react';
import { ListSubheader, List, ListItemButton, Checkbox, ListItemIcon, Collapse, ListItemText, FormControlLabel } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

function NestedListItems() {
    const [open, setOpen] = React.useState(true);

    const handleClick = (id) => {
        console.log("click")
    };
    return (
        <List
            sx={{ width: '100%', maxWidth: 330, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Filter Menu
                </ListSubheader>
            }
        >
            <CustomMultiSelect defaultValue={[10, 20]}>
                <StyledOption value={10}>Ten</StyledOption>
                <StyledOption value={20}>Twenty</StyledOption>
                <StyledOption value={30}>Thirty</StyledOption>
                <StyledOption value={40}>Forty</StyledOption>
                <StyledOption value={50}>Fifty</StyledOption>
            </CustomMultiSelect>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                </ListItemIcon>
                <ListItemText primary="Interests" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" id="interest-list" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <FormControlLabel
                            value="skiing"
                            control={<Checkbox color="primary" />}
                            label="Skiing"
                            labelPlacement="end"
                        />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <FormControlLabel
                            value="rafting"
                            control={<Checkbox color="primary" />}
                            label="Rafting"
                            labelPlacement="end"
                        />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <FormControlLabel
                            value="skydiving"
                            control={<Checkbox color="primary" />}
                            label="Skydiving"
                            labelPlacement="end"
                        />
                    </ListItemButton>
                </List>
            </Collapse>

            <ListItemButton>
                <ListItemIcon>
                </ListItemIcon>
                <ListItemText primary="Age" />
            </ListItemButton>

            <ListItemButton>
                <ListItemIcon>
                </ListItemIcon>
                <ListItemText primary="Group Size" />
            </ListItemButton>

            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                </ListItemIcon>
                <ListItemText primary="Location" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <FormControlLabel
                            value="trondheim"
                            control={<Checkbox color="primary" />}
                            label="Trondheim"
                            labelPlacement="end"
                        />
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <FormControlLabel
                            value="oslo"
                            control={<Checkbox color="primary" />}
                            label="Oslo"
                            labelPlacement="end"
                        />
                    </ListItemButton>

                </List>
            </Collapse>
        </List>
    );
};

export default NestedListItems;
