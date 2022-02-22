import React from 'react';
import {Container} from '@mui/material';
import RegisterForm from '../components/userInput/RegisterForm';

/**
 * A page for user registration.
 * @return {JSX.Element}
 * @constructor
 */
function RegisterPage() {
  return <Container>
    <h1 style={{textAlign: 'center', margin: '4rem'}}>Welcome to GroupUp</h1>
    <RegisterForm/>
  </Container>;
}

export default RegisterPage;
