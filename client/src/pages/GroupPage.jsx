import {Button, Card, Container, Grid, Dialog, DialogTitle, Box, List, ListItem, ListItemText, Snackbar, Alert} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {UserContext} from '../contexts/User';

export default function GroupPage() {
  const {groupId} = useParams();
  const [groupInfo, setGroupInfo] = useState({});
  const [groupMatches, setGroupMatches] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [userState, userDispatch] = useContext(UserContext);


  useEffect(async () => {
    await fetchGroupInfo();
    await fetchMatches();
    await fetchAllUsers();
    await fetchGroupMembers();
  }, [groupId]);

  const fetchGroupInfo = async () => {
    await fetch('/api/get-group', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({groupId: groupId}),
    }).then((res) => res.json())
        .then((result) => {
          setGroupInfo(result);
        });
  };

  const fetchMatches = async () => {
    await fetch('/api/get-group-matches', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({groupId: groupId}),
    }).then((res) => res.json())
        .then((result) => {
          setGroupMatches(result);
        });
  };

  const fetchAllUsers = async () => {
    await fetch('/api/get-users')
        .then((res) => res.json())
        .then((result) => {
          setAllUsers(result);
        });
  };

  const sendInvite = async (username) => {
    await fetch('/api/invite-user-to-group', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        groupId: groupId,
        username: username,
      }),
    }).then((res) => {
      if (res.ok) {
        setSnackbarOpen(true);
      } else {
        // could not invite
      }
    });
  };

  const fetchGroupMembers = async () => {
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

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (<Container>
    <br />
    <Button
      variant='outlined'
      onClick={() => navigate('/home')}
    >
      Home
    </Button>
    <h1>Welcome to {groupInfo.name}</h1>
    {/* <p>ID: {groupId} </p> */}
    <p>Admin: {groupInfo.admin} </p>
    <p>Description: {groupInfo.description} </p>

    <h2>Matches</h2>
    <Card sx={{padding: '2rem'}} variant="outlined">
      <Grid
        container
        spacing={{xs: 2, md: 3}}
        columns={{xs: 4, sm: 8, md: 12}}
      >
        {Array.from(groupMatches).map((match) =>
          <Grid item xs={2} sm={4} md={4} key={match.groupId}>
            <Card sx={{padding: '1rem'}} elevation={3}>
              <h1>{match.name}</h1>
              <Button
                onClick={() => navigate('/group/' + match.groupId)}
              >
                Visit
              </Button>
            </Card>
          </Grid>,
        )}
      </Grid>
    </Card>

    <h2>Members</h2>
    <List>
      {Array.from(groupMembers).map((user) =>
        <ListItem
          key={user.username}
          value={user.username}>
          <ListItemText primary={user.username}></ListItemText>
        </ListItem>)
      }
    </List>

    <Button
      variant='outlined'
      onClick={() => {
        setInviteDialogOpen(true);
      }}>
      Add Members
    </Button>

    <Dialog onClose={() => inviteDialogOpen(false)} open={inviteDialogOpen}>
      <Container sx={{padding: '1rem'}} >
        <DialogTitle>Add new member</DialogTitle>
        <p textalign='center'>Who do you want to add?</p>
        <br />
        <List style={{maxHeight: 150, overflow: 'auto'}}>
          {Array.from(allUsers).filter((user) => {
            for (const member of groupMembers) {
              if (member.username == user.username) {
                return false;
              }
            }
            return true;
          }).map((user) =>
            <ListItem
              key={user.username}
              value={user.username}>
              <ListItemText primary={user.username}></ListItemText>
              <Button
                variant='contained'
                onClick={() => {
                  sendInvite(user.username);
                }}
              >Invite</Button>
            </ListItem>)
          }
        </List>

        <Box textAlign='center'>
          <Button
            variant='outlined'
            onClick={() => setInviteDialogOpen(false)}
          >
              Cancel
          </Button>
        </Box>
      </Container>
    </Dialog>

    <Snackbar
      open={snackbarOpen}
      autoHideDuration={4000}
      onClose={handleSnackbarClose}
    >
      <Alert onClose={handleSnackbarClose} severity="success" sx={{width: '100%'}}>
          Invite sent!
      </Alert>
    </Snackbar>
  </Container>
  );
}

