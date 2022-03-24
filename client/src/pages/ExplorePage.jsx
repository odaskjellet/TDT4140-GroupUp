import React, {useContext, useEffect, useState} from 'react';
import {Container, Stack, Card, Grid, Button, Dialog, DialogTitle, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert, List, ListItem, ListItemText, Chip, Box}
  from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../contexts/User';
import FilterMenu from '../components/userInput/FilterMenu';

export default function ExplorePage() {
  const navigate = useNavigate();
  const [allGroups, setAllGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGroupA, setSelectedGroupA] = useState({});
  const [selectedGroupBId, setSelectedGroupBId] = useState('');
  const [userState, _] = useContext(UserContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [incompleteMatches, setIncompleteMatches] = useState([]);
  const [groupMembership, setGroupMembership] = useState('');
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupInfo, setGroupInfo] = useState({});
  const [interests, setInterests] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(async () => {
    // await fetchAllGroups();
    await fetchMyGroups();
  }, []);

  // const fetchAllGroups = async () => {
  //   fetch('/api/get-groups')
  //       .then((res) => res.json())
  //       .then((result) => {
  //         setAllGroups(result);
  //       });
  // };

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

  const fetchIncompleteMatches = async (groupId) => {
    fetch('/api/get-incomplete-group-matches', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({groupId: groupId}),
    }).then((res) => res.json())
        .then((result) => {
          setIncompleteMatches(result);
        });
  };

  const createMatch = async (isSuperLike) => {
    fetch('/api/match-groups', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        primaryId: selectedGroupA.groupId,
        secondaryId: selectedGroupBId,
        isSuperLike: isSuperLike,
      }),
    }).then((res) => {
      if (res.ok) {
        setSnackbarOpen(true);
      } else {
        // Did not create match
      }
    });
  };

  const onSelect = async (e) => {
    setSelectedGroupBId(e.target.value);
    await getGroupMembership(e.target.value);
  }

  const getGroupMembership = async (groupId) => {
    fetch('/api/get-group-membership', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({groupId: groupId}),
    }).then((res) => res.json())
      .then((result) => {
        setGroupMembership(result.membership);
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const fetchGroupInterest = async (groupId) => {
    await fetch('/api/get-group-interests', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        groupId: groupId,
      }),
    }).then((res) => res.json()).
    then((result) => {
      setInterests(result);
    });
  };

  const fetchGroupMembers = async (groupId) => {
    await fetch('/api/get-group-members', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        groupId: groupId,
      }),
    }).then((res) => res.json()).
        then((result) => {
          setGroupMembers(result);
        });
  };

  const fetchGroupInfo = async (groupId) => {
    await fetch('/api/get-group', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({groupId: groupId}),
    }).then((res) => res.json())
        .then((result) => {
          setGroupInfo(result);
        });
  };


  const setAndOpenGroupDialog = (groupId) => {
    fetchGroupInterest(groupId)
    fetchGroupInfo(groupId);
    fetchGroupMembers(groupId);
    setGroupDialogOpen(true);
    
  }

  function filterCallback(data) {
    setAllGroups(data);
  }

  let matchExists = Boolean(incompleteMatches.some((e) => e.groupId === selectedGroupBId))

  let superLikeButtonStyle = (!matchExists && groupMembership === 'gold')
    ? {backgroundColor: 'gold', color: 'black'}
    : {}
  
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
      <div
      style={{width:"20%",height:"46%",display:"table",float:"left",position:"sticky",}}>
        <FilterMenu filterCallback={filterCallback} />
      </div>
      <div
      style={{width:"75%",display:"table", float:"right"}}>
      <Stack spacing={2}>
        {Array.from(allGroups).map((group) => (
          <Card key={group.groupId} sx={{padding: '2rem'}}>
            <h2>{group.name}</h2>
            <Button
              variant='contained'
              onClick={() => {
                setSelectedGroupA(group);
                setSelectedGroupBId('');
                setGroupMembership('standard');
                fetchIncompleteMatches(group.groupId);
                setDialogOpen(true);
              }}
            >
              Match
            </Button>
            <Button   
              onClick={() => setAndOpenGroupDialog(group.groupId)}
            >
              Group info
            </Button>
          </Card>
        ))}
      </Stack>
      </div>

      <Dialog style={{minHeight: '100%', maxHeight: '100%'}}    onClose={() => groupDialogOpen(false)} open={groupDialogOpen}>
      <Container sx={{padding: '1rem'}} >
        {/* <p>Image link: {groupInfo.image}</p> */}
        <img src={groupInfo.image} alt="" style={{borderRadius: '15px' , display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '80%',}}/>

        <DialogTitle style={{textAlign: 'center',
          position: 'relative',
          textTransform: 'uppercase',}}>{groupInfo.name}</DialogTitle>

        <p id={"group-admin"}>Admin: {groupInfo.admin} </p>
        <p id={"group-location"}>Location: {groupInfo.location}</p>
        <p id={"group-description"}>Description: {groupInfo.description} </p>

        <p>Members: </p>
        <List style={{maxHeight: 150, overflow: 'auto',}}>
          {Array.from(groupMembers).map((user) =>
            <ListItem
              key={user.username}
              value={user.username}>
              <ListItemText primary={user.username}></ListItemText>
          </ListItem>)
        }
      </List>
        <p>Interests: </p>
        {interests.map((interest) => (
            <Chip sx={{margin: '0.5rem'}} color='primary' label={interest.interest}/>
        ))}
 
        <Box textAlign='center'>
          <Button
            sx={{margin: '1rem'}}
            variant='outlined'
            onClick={() => setGroupDialogOpen(false)}
          >
              Close
          </Button>
        </Box>
      </Container>
    </Dialog>





      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <Container sx={{padding: '1rem'}}>
          <DialogTitle>Select match</DialogTitle>
          {!Boolean(myGroups.length) && <div>
            <Stack>
              <p>
                You have to be member of a group to match with other groups!
              </p>
              <br />
              <Button
                variant='outlined'
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
            </Stack>
          </div>}
          {Boolean(myGroups.length) && <div>
            <p>What group do you want to match <b>{selectedGroupA.name}</b> with?</p>
            <br />
            <FormControl fullWidth>
              <InputLabel id="group-select-label">Group</InputLabel>
              <Select
                labelId='group-select-label'
                label='Group'
                value={selectedGroupBId}
                onChange={onSelect}
              >
                {Array.from(myGroups).filter((group) =>
                  (group.groupId !== selectedGroupA.groupId),
                ).map((group) => (
                  <MenuItem
                    key={group.groupId}
                    value={group.groupId}
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
                disabled={matchExists || groupMembership !== 'gold'}
                style={superLikeButtonStyle}
                onClick={() => {
                  createMatch("true");
                  setDialogOpen(false);
                }}>
                  <span>Super Like!</span>
              </Button>
              <Button
                variant='contained'
                disabled={matchExists || selectedGroupBId === '' }
                onClick={() => {
                  createMatch("false");
                  setDialogOpen(false);
                }}
              >
                {
                  !matchExists && <span>Confirm</span>
                }
                {
                  matchExists && <span>Match already initiated</span>
                }
              </Button>
            </Stack>
          </div>}
        </Container>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{width: '100%'}}>
          Match initiated!
        </Alert>
      </Snackbar>

    </Container>
  );
}
