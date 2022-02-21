import React from 'react';
import {Container, Stack, Card, Avatar, Grid, Button} from '@mui/material';
import {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../contexts/User';
import AddIcon from '@mui/icons-material/Add';

/**
 * The home page: the page the user sees after logging in.
 * @return {JSX.Element}
 * @constructor
 */
function HomePage() {
  const [userState, userDispatch] = useContext(UserContext);
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  useEffect(async () => {
    await fetchGroups();
    await fetchUserInfo();
  }, []);

  const fetchGroups = async () => {
    fetch('/api/get-groups-with-user', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: userState.username}),
    }).then((res) => res.json())
      .then((result) => {
      setGroups(result);
    });
  };

  const fetchUserInfo = async () => {
    fetch('/api/get-user', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: userState.username}),
    }).then((res) => res.json())
      .then((result) => {
      setUserInfo(result);
    });
  };

  const onSignOutButton = () => {
    userDispatch({type: 'logout'});
    navigate('/');
  };

  if (!userState.verified) {
    return <div>You are not logged in!</div>;
  } else {
    return <Container>
      <Stack spacing={2}>
        <br />
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={4}
        >
          <div>
            <h2>Hello {userState.username}!</h2>
            <p>Email: {userInfo.email}</p>
            <p>Age: {userInfo.age}</p>
            <p>Gender: {userInfo.gender}</p>
          </div>
          <Stack
            alignItems="right"
            spacing={2}
          >
            <div onClick={() => navigate('/user')}>
              <Avatar
                alt=""
                src=""
                sx={{width: 80, height: 80}}
              />
            </div>
            <Button>Edit</Button>
            <Button onClick={onSignOutButton}>Sign out</Button>
          </Stack>
        </Stack>

        <h2>Interests</h2>
        <Card sx={{padding: '2rem'}} variant="outlined">
          <Grid
            container
            spacing={{xs: 2, md: 3}}
            columns={{xs: 4, sm: 8, md: 12}}
          >
          </Grid>

          <Stack
            sx={{padding: '1rem'}}
            spacing={2}
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
              variant="contained"
            >
              Add interest
            </Button>
          </Stack>
        </Card>

        <h2>Groups</h2>
        <Card sx={{padding: '2rem'}} variant="outlined">
          <Grid
            container
            spacing={{xs: 2, md: 3}}
            columns={{xs: 4, sm: 8, md: 12}}
          >
            {Array.from(groups).map((group) =>
              <Grid item xs={2} sm={4} md={4} key={group.id}>
                <Card sx={{padding: '1rem'}} elevation={3}>
                  <h1>{group.name}</h1>
                  <Button
                    onClick={() => navigate('/group/' + group.id)}
                  >
                    Visit
                  </Button>
                </Card>
              </Grid>,
            )}
          </Grid>

          <Stack
            sx={{padding: '1rem'}}
            spacing={2}
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
              startIcon={<AddIcon/>}
              variant="outlined"
              onClick={() => navigate('/create-group')}
            >
              Create new group
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/explore')}
            >
              Explore matches
            </Button>
          </Stack>
        </Card>
        
        <h2>Feed</h2>
        <Card sx={{padding: '2rem'}} variant="outlined">
          <Grid
            container
            spacing={{xs: 2, md: 3}}
            columns={{xs: 4, sm: 8, md: 12}}
          >
          </Grid>
        </Card>

      </Stack>
    </Container>;
  }
}

export default HomePage;
