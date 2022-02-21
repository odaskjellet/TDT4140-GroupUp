import { Container } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';

export default function GroupPage() {
  const { id } = useParams();

  return (<Container>
    <h1>Welcome to group {id}</h1>
  </Container>
  );
}
