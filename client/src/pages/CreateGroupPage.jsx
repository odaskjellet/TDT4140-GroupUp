import React from 'react';
import {Container} from '@mui/material';
import CreateGroupForm from '../components/userInput/CreateGroupForm';

/**
 * returns a page with the form used to createGroups
 * @return {JSX.Element}
 * @constructor
 */
export default function CreateGroupPage() {
  return <Container>
    <br/>
    <br/>
    <CreateGroupForm/>
  </Container>;
}
