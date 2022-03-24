import React, {useContext, useEffect, useState} from 'react';
import {
  Alert, Box,
  Button,
  Card, CardMedia,
  Container,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../contexts/User';
import FilterMenu from '../components/userInput/FilterMenu';

/**
 * returns the page where users can explore other groups and like them.
 * @return {JSX.Element}
 * @constructor
 */
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
  };

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

  /**
 * function to filter data
 * @param data
 */
  function filterCallback(data) {
    setAllGroups(data);
  }

  const matchExists = Boolean(incompleteMatches.some((e) =>
    e.groupId === selectedGroupBId));

  const superLikeButtonStyle = (!matchExists && groupMembership === 'gold') ?
    {backgroundColor: 'gold', color: 'black'} :
    {};

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
        style={{width: '20%', height: '46%', display: 'table',
          float: 'left', position: 'sticky'}}>
        <FilterMenu filterCallback={filterCallback} />
      </div>
      <div
        style={{width: '75%', display: 'table', float: 'right'}}>
        <Stack spacing={2}>
          {Array.from(allGroups).map((group) => (
            <Card sx = {{display: 'flex'}} key={group.groupId}>
              <Box sx={{padding: '2rem'}}>
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

              </Box>

              <CardMedia
                component="img"
                sx={{width: 151}}
                image={group.image}
                alt="Live from space album cover"
                style={{marginLeft: 'auto'}}
              />

            </Card>
          ))}
        </Stack>
      </div>

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
            <p>What group do you want to match
              <b>{selectedGroupA.name}</b> with?</p>
            <br />
            <FormControl fullWidth>
              <InputLabel id="group-select-label">Group</InputLabel>
              <Select
                id={'group-select'}
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
                  createMatch('true');
                  setDialogOpen(false);
                }}>
                <span>Super Like!</span>
              </Button>
              <Button
                variant='contained'
                disabled={matchExists || selectedGroupBId === '' }
                onClick={() => {
                  createMatch('false');
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
        <Alert onClose={handleSnackbarClose} severity="success"
          sx={{width: '100%'}}>
          Match initiated!
        </Alert>
      </Snackbar>

    </Container>
  );
}
