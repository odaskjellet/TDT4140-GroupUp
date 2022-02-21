import { Button, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function GroupPage() {
  const { id } = useParams();
  const [groupInfo, setgroupInfo] = useState({});
  const navigate = useNavigate();
  
  useEffect(async () => {
    await fetchGroupInfo();
  }, []);

  const fetchGroupInfo = async () => {
    fetch('/api/get-group', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: id}),
    })  .then((res) => res.json())
        .then((result) => {
      setgroupInfo(result);
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
  </Container>
  );
}
