import Card from '../../ui/Card';
import classes from './LoginForm.module.css';


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
      </div>

    </form>

  </Card>;
}


export default LoginForm;
