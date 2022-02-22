import { Button, Card, Container, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function GroupPage() {
  const { id } = useParams();
  const [groupInfo, setGroupInfo] = useState({});
  const [groupMatches, setGroupMatches] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(async () => {
    await fetchGroupInfo();
    await fetchMatches();
  }, [id]);

  const fetchGroupInfo = async () => {
    fetch('/api/get-group', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: id}),
    }).then((res) => res.json())
      .then((result) => {
        setGroupInfo(result);
    });
  };

  const fetchMatches = async () => {
    fetch('/api/get-group-matches', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: id}),
    }).then((res) => res.json())
      .then((result) => {
        setGroupMatches(result);
    });
  };

  //Hente alle brukere fra databasen
  const fetchAllUsers = async () => {
    fetch('api/get-users') //må lage url i server
    .then((res) => res.json())
    .then((result) => {
      setAllUsers(true); //et resultat vi gjør noe med 
    }); 
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
    <p>ID: {id} </p>
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
          <Grid item xs={2} sm={4} md={4} key={match.id}>
            <Card sx={{padding: '1rem'}} elevation={3}>
              <h1>{match.id}</h1>
              <Button
                onClick={() => navigate('/group/' + match.id)}
              >
                Visit
              </Button>
            </Card>
          </Grid>,
        )}
      </Grid>
    </Card>

    <Button
    variant='outlined'
    onClick={() => {
      setInviteDialogOpen(true);
    }}>
      Add Members
    </Button>

    {/* <Dialog onClose={() => inviteDialogOpen = false open={inviteDialogOpen}}>
      <Container>
        <DialogTitle>Add new member</DialogTitle>
        <p>Who do you want to add?</p>
      </Container>

    </Dialog> */}

    <h2>Members</h2>
  
  </Container>
  );
}

/**
 * TODO
 *  [] Legge til "add member" button
 *  [] Knytte den opp mot en invitasjonslogikk
 *  [] Legge til invitasjon i database, relasjonstabell mellom gruppe og bruker
 * 
 *  [] Legge til en liste over medlemmer, kjøre et API kall for å hente alle medlemmer. 
 * 
 *  [] Gi alle medlemmer tilgang til gruppa når de har akseptert invitasjonen
 */
