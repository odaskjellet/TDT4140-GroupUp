import React, { useContext, useEffect, useState } from 'react';
import {Container, Stack, Card, Grid, Button, Dialog, DialogTitle, Select, MenuItem, FormControl, InputLabel}
    from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/User';

export default function ExplorePage() {
  const navigate = useNavigate();
  const [allGroups, setAllGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGroupA, setSelectedGroupA] = useState({});
  const [selectedGroupBId, setSelectedGroupBId] = useState('');
  const [userState, _] = useContext(UserContext);

  useEffect(async () => {
    await fetchAllGroups();
    await fetchMyGroups();
  }, []);

  const fetchAllGroups = async () => {
    fetch('/api/get-groups')
      .then((res) => res.json())
      .then((result) => {
      setAllGroups(result);
    });
  };

  const fetchMyGroups = async () => {
    fetch('/api/get-groups-with-user', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: userState.username}),
    }).then((res) => res.json())
      .then((result) => {
      setMyGroups(result);
    });
  };

  const createMatch = async () => {
    fetch('/api/match-groups', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        primaryId: selectedGroupA.id,
        secondaryId: selectedGroupBId
      }),
    }).then((res) => {
      if (res.ok) {
        // Created match
      } else {
        // Did not create match
      }
    });
  }

  return (
    <Container>
      <br />
      <br />
      <Button
        variant='outlined'
        onClick={() => navigate('/home')}
      >
        Home
      </Button>
      <h1>Explore groups</h1>
      <p>Find the perfect match.</p>

      <Stack spacing={2}>
        {Array.from(allGroups).map((group) => (
          <Card key={group.id} sx={{padding: '2rem'}}>
            <h2>{group.name}</h2>
            <p>Group {group.id}</p>
            <Button
              variant='contained'
              onClick={() => {
                setSelectedGroupA(group);
                setDialogOpen(true);
              }}
            >
              Match
            </Button>
          </Card>
        ))}
      </Stack>

      <Dialog onClose={() => dialogOpen = false} open={dialogOpen}>
        <Container sx={{padding: '1rem'}}>
          <DialogTitle>Select match</DialogTitle>
          <p>What group do you want to match <b>{selectedGroupA.name}</b> with?</p>
          <br />
          <FormControl fullWidth>
            <InputLabel id="group-select-label">Group</InputLabel>
            <Select
              labelId='group-select-label'
              label='Group'
              value={selectedGroupBId}
              onChange={(e) => setSelectedGroupBId(e.target.value)}
            >
              {Array.from(myGroups).map((group) => (
                <MenuItem
                  key={group.id}
                  value={group.id}
                >
                  {group.name}
                </MenuItem>
                ))}
            </Select>
          </FormControl>
          <br />
          <br />

          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Button
              variant='outlined'
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={() => {
                createMatch();
                setDialogOpen(false);
              }}
            >
              Confirm
            </Button>
          </Stack>
        </Container>
      </Dialog>
    </Container>
  );
}
