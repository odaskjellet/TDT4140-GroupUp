import {useForm} from 'react-hook-form';
import classes from './LoginForm.module.css';
import Card from '../../ui/Card';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../../contexts/User';
import {useContext} from 'react';

/**
 * Returns a login form with client side validation.
 * @return {JSX.Element}
 * @constructor
 */
function LoginForm() {
  const {register, formState: {errors}, handleSubmit} = useForm();

  const navigate = useNavigate();
  const [userState, userDispatch] = useContext(UserContext);
  const onSubmit = async (data) => {
    fetch('/api/try_login', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        userDispatch({type: 'login', username: data.username});
        navigate('../home');
      } else {
        console.log('Could not login!'); // TODO
      }
    });
  };

  return (
    <Card>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.control}>
          <label htmlFor={'username'}>Username</label>
          <input {...register('username', {required: true, maxLength: 40, pattern: /^[a-z ,.'-]+$/i})} />
          {errors.username?.type === 'required' && 'Username is required'}
        </div>

        <div className={classes.control}>
          <label htmlFor={'password'}>Password</label>
          <input type={'password'} {...register('password',
              {required: true})} />
          {errors.password && 'Password is required'}
        </div>

        <div className={classes.actions}>
          <button className={classes.buttonPrimary}>Login</button>
          <p>Don't have an account? <a href='/register'>Sign up</a></p>
        </div>

      </form>
    </Card>
  );
}


export default LoginForm;
