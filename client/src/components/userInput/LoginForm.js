import Card from '../../ui/Card';
import classes from './LoginForm.module.css';
import {Link} from 'react-router-dom';


/**
 * Returns a login form wrapped in custom card div.
 * @return {JSX.Element}
 * @constructor
 */
function LoginForm() {
  return <Card>
    <form className={classes.form}>

      <div className={classes.control}>
        <label htmlFor={'username'}>Username</label>
        <input type={'text'} required id={'username'}/>
      </div>

      <div className={classes.control}>
        <label htmlFor={'password'}>Password</label>
        <input type={'password'} required id={'password'}/>
      </div>

      <div className={classes.actions}>
        <button>Login</button>
        <Link to ={'/register'}> <button>Register</button> </Link>

      </div>

    </form>

  </Card>;
}


export default LoginForm;
