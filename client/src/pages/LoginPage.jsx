import React from 'react';
import {Container} from '@mui/material';
import LoginForm from '../components/userInput/LoginForm';

/**
 * A page for user login.
 * @return {JSX.Element}
 * @constructor
 */
function LoginPage() {
  return <Container>
    <div style={{textAlign: 'center'}}>
      <img src="/logoGU.png" style=
        {{margin: '0.5rem', maxHeight: '200px'}} alt={'group up logo'}/>
      <h1 style={{textAlign: 'center', margin: '2rem'}}>Welcome to GroupUp</h1>
    </div>
    <LoginForm/>
  </Container>;
}

export default LoginPage;
