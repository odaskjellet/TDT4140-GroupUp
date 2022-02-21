import React, { useEffect, useState } from 'react';
import {Container, Stack, Card, Grid, Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ExplorePage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  useEffect(async () => {
    await fetchGroups();
  }, []);

  const fetchGroups = async () => {
    fetch('/api/get-groups')
      .then((res) => res.json())
      .then((result) => {
      setGroups(result);
    });
  };

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
      <p>Find the perfect match</p>

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
                >
                  Match
                </Button>
              </Card>
            </Grid>,
          )}
        </Grid>
      </Card>

    </Container>
  );
}
