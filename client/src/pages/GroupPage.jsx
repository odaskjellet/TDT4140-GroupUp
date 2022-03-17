import {Button, Card, Container, Grid, Dialog, DialogTitle, Box, List, ListItem, ListItemText, Snackbar, Alert, Chip} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

export default function GroupPage() {
  const {groupId} = useParams();
  const [groupInfo, setGroupInfo] = useState({});
  const [matchInfo, setMatchInfo] = useState({});


  const [groupMatches, setGroupMatches] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupInvitations, setGroupInvitations] = useState([]);
  const [interests, setInterests] = useState([]);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [matchMembers, setMatchMembers] = useState([]);

  const navigate = useNavigate();

  useEffect(async () => {
    await fetchGroupInfo();
    await fetchMatches();
    await fetchAllUsers();
    await fetchGroupMembers();
    await fetchGroupInvites();
    await fetchGroupInterests();
    await fetchMatchInfo();
    await fetchMacthMembers();
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

  const fetchMatchInfo = async (groupId) => {
    await fetch('/api/get-group', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({groupId: groupId}),
    }).then((res) => res.json())
        .then((result) => {
          setMatchInfo(result);
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

  const fetchMatchMembers = async (groupId) => {
    await fetch('/api/get-group-members', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        groupId: groupId,
      }),
    }).then((res) => res.json()).
        then((result) => {
          setMatchMembers(result);
        });
  };

  const fetchGroupInvites = async () => {
    await fetch('/api/get-group-invitations', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        groupId: groupId,
      }),
    }).then((res) => res.json()).
        then((result) => {
          setGroupInvitations(result);
        });
  };
  
  const membership = groupInfo.membership === 'standard' ? '' : 'gold';

  const fetchGroupInterests = async () => {
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

  const fetchMatchGroupInterest = async (groupId) => {
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

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const setAndOpenGroupDialog = (groupId) => {
    fetchMatchGroupInterest(groupId)
    fetchMatchInfo(groupId);
    fetchMatchMembers(groupId);
    setGroupDialogOpen(true);


  }


  const styles = {
    marginTop: '10px',
    padding: '60px',
    borderStyle: 'solid',
    borderColor: membership,
    borderRadius: '15px',
  };


  const inputStyle = {
    padding: '2rem',
  };


  const textBoxStyle = {
    color: membership,
    fontFamily: 'serif',
    position: 'relative',
    textTransform: 'uppercase',
    fontSize: '3vw',
    margin: '0',
    fontWeight: 400,
    textAlign: 'center',

  };


  return (<Container style={styles}>
    <br />
    <p style={textBoxStyle}>  {groupInfo.membership} Membership </p>
    <Button
      variant='outlined'
      onClick={() => navigate('/home')}
    >
      Home
    </Button>

    <Button
      onClick={() => navigate('/edit-group/' + groupId)}
    >
      Edit
    </Button>
    
    <h1>Welcome to {groupInfo.name}</h1>
    {interests.map((interest) => (
      <Chip label={interest.interest} sx={{margin: '0.5rem'}} color='primary'/>
    ))}
    {/* <p>ID: {groupId} </p> */}
    <p>Admin: {groupInfo.admin} </p>
    <p>Location: {groupInfo.location}</p>
    <br />
    <p>{groupInfo.description} </p>
    {/* <p>Image link: {groupInfo.image}</p> */}
    <img src={groupInfo.image} alt="" style={{maxWidth: '500px'}}/>



    <h2>Matches</h2>
    <Card sx={inputStyle} variant="outlined">
      <Grid
        container
        spacing={{xs: 2, md: 3}}
        columns={{xs: 4, sm: 8, md: 12}}
      >
        {groupMatches.map((match) =>
          <Grid item xs={2} sm={4} md={4} key={match.groupId}>
            <Card sx={{padding: '1rem'}} elevation={3}>
              <h1>{match.name}</h1>
              <Button
                onClick={() => setAndOpenGroupDialog(match.groupId)}
              >
                Visit
              </Button>
            </Card>
          </Grid>,
        )}
      </Grid>
    </Card>

    <Dialog style={{minHeight: '100%', maxHeight: '100%'}}    onClose={() => groupDialogOpen(false)} open={groupDialogOpen}>
      <Container sx={{padding: '1rem'}} >
        {/* <p>Image link: {groupInfo.image}</p> */}
        <img src={matchInfo.image} alt="" style={{borderRadius: '15px' , display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '80%',}}/>

        <DialogTitle style={{textAlign: 'center',
          position: 'relative',
          textTransform: 'uppercase',}}>{matchInfo.name}</DialogTitle>

        <p id={"group-admin"}>Admin: {matchInfo.admin} </p>
        <p id={"group-location"}>Location: {matchInfo.location}</p>
        <p id={"group-description"}>Description: {matchInfo.description} </p>

        <p>Members: </p>
        <List style={{maxHeight: 150, overflow: 'auto'}}>
          {Array.from(matchMembers).map((user) =>
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
            sx={{margin: 'rem'}}
            variant='outlined'
            onClick={() => setGroupDialogOpen(false)}
          >
              Close
          </Button>
        </Box>
      </Container>
    </Dialog>

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
        <p textalign='center'>Who do you want to invite?</p>
        <br />

        {Boolean(!allUsers.some((user) => (
          !groupMembers.some((e) => e.username === user.username)
        ))) && <div>
          <p>There are noone to invite!</p>
        </div>}

        <List style={{maxHeight: 150, overflow: 'auto'}}>
          {allUsers.filter((user) => (
            !groupMembers.some((e) => e.username === user.username)
          )).map((user) =>
            <ListItem
              key={user.username}
              value={user.username}>
              <ListItemText primary={user.username}></ListItemText>
              <Button
                variant='contained'
                disabled=
                  {groupInvitations.some((e) => e.username === user.username)}
                onClick={async () => {
                  await sendInvite(user.username);
                  await fetchGroupInvites();
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

