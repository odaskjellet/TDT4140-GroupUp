import RegisterForm from '../components/userInput/RegisterForm';
import classes from './LoginPage.module.css';

/**
 * A page for user registration.
 * @return {JSX.Element}
 * @constructor
 */
function RegisterPage() {
  return <div className={classes.wrapper}>
    <h1 style={{textAlign: 'center', margin: '4rem'}}>Welcome to GroupUp</h1>
    <RegisterForm/>
  </div>;
}

export default RegisterPage;
