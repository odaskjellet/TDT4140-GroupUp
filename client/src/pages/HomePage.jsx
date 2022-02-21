import {Container, Stack, Paper, Avatar, ImageList, Grid, Button} from '@mui/material';
import {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../contexts/User';
import Card from '../ui/Card';

/**
 * The home page: the page the user sees after logging in.
 * @return {JSX.Element}
 * @constructor
 */
function HomePage() {
  const [userState, userDispatch] = useContext(UserContext);
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  useEffect(async () => {
    await fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const res = await fetch('/api/get-groups');
    setGroups(await res.json());
  };

  if (!userState.verified) {
    return <div>You are not logged in!</div>;
  } else {
    return <Container fixed>
      <Stack spacing={2}>
        <br />
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={4}
        >
          <h2>Hello {userState.username}!</h2>
          <div onClick={() => navigate('/user')}>
            <Avatar
              alt=""
              src=""
              sx={{width: 80, height: 80}}
            />
          </div>
        </Stack>

        <h1>My groups</h1>
        <Card>
          <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 12}}>
            {Array.from(groups).map((group) =>
              <Grid item xs={2} sm={4} md={4} key={group.id}>
                <Card>
                  <h1>Group: {group.name}</h1>
                </Card>
              </Grid>,
            )}
          </Grid>

          <Button
            variant="contained"
            onClick={() => navigate('/create-group')}
          >
            Create new group
          </Button>

        </Card>
      </Stack>
    </Container>;
  }
}

export default HomePage;
