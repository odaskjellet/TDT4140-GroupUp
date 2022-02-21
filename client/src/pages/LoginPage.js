import LoginForm from '../components/userInput/LoginForm';
import classes from './LoginPage.module.css';

/**
 * A page for user login.
 * @return {JSX.Element}
 * @constructor
 */
function LoginPage() {
  return <div className={classes.wrapper}>
    <h1 style={{textAlign: 'center', margin: '4rem'}}>Welcome to GroupUp</h1>
    <LoginForm/>
  </div>;
}

export default LoginPage;
