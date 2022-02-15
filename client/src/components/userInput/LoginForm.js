import {useForm} from 'react-hook-form';
import classes from './LoginForm.module.css';
import Card from '../../ui/Card';
import {Link} from 'react-router-dom';

/**
 * Returns a login form with client side validation.
 * @return {JSX.Element}
 * @constructor
 */
function LoginForm() {
  const {register, formState: {errors}, handleSubmit} = useForm();
  const onSubmit = (data) => console.log(data);


  return (
    <Card>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.control}>
          <label htmlFor={'username'}>Username</label>
          <input {...register('username', {required: true, maxLength: 40, pattern: /^[a-z ,.'-]+$/i})} />
          {errors.username?.type === 'required' && 'Username is required'}
        </div>


        <div className={classes.control}>
          <label htmlFor={'password'}>Your password</label>
          <input type={'password'} {...register('password',
              {required: true})} />
          {errors.password && 'Password is required'}
        </div>

        <div className={classes.actions}>
          <button>Login</button>
          <Link to={'/register'}>
            <button>Register</button>
          </Link>
        </div>


      </form>
    </Card>
  );
}

export default LoginForm;
