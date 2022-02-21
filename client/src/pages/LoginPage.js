import { Container } from '@mui/material';
import LoginForm from '../components/userInput/LoginForm';

/**
 * A page for user login.
 * @return {JSX.Element}
 * @constructor
 */
function LoginPage() {
  return <Container>
    <h1 style={{textAlign: 'center', margin: '4rem'}}>Welcome to GroupUp</h1>
    <LoginForm/>
  </Container>
}

export default LoginPage;
