import React from 'react';
import {Container} from '@mui/material';
import EditGroupForm from '../components/userInput/EditGroupForm';

/**
 * returns a page with the form used to edit groups.
 * @return {JSX.Element}
 * @constructor
 */
export default function CreateGroupPage() {
  return <Container>
    <br/>
    <br/>
    <EditGroupForm/>
  </Container>;
}
