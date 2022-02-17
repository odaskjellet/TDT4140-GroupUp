import {useForm} from 'react-hook-form';
import Card from '../../ui/Card';
import classes from './LoginForm.module.css';
import {useNavigate} from 'react-router-dom';

/**
 * Returns a register form wrapped in custom card div.
 * @return {JSX.Element}
 * @constructor
 */
function RegisterForm() {
  const {
    register,
    formState: {errors},
    getValues,
    handleSubmit,
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    fetch('/api/insert', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        navigate('../home');
      } else {
        console.log('Could not register user!'); // TODO
      }
    });
  };

  return (
    <Card>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.control}>
          <label htmlFor={'username'}>Your username</label>
          <input {...register('username', {required: true, maxLength: 40, pattern: /^[a-z ,.'-]+$/i})} />
          {errors.username?.type === 'required' && 'Username is required'}
        </div>

        <div className={classes.control}>
          <label>Your age</label>
          <input type="number" {...register('age', {required: true, min: 18, max: 99})} />
          {errors.age && 'You need to be between 18 and 99 years old.'}
        </div>

        <div className={classes.control}>
          <label>Your gender</label>
          <select required={true} {...register('gender')}>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className={classes.control}>
          <label htmlFor={'email'}>Your email</label>
          <input type={'email'} {...register('email', {required: true, maxLength: 40})} />
          {errors.email && 'Email is required'}
        </div>

        <div className={classes.control}>
          <label htmlFor={'password'}>Your password</label>
          <input type={'password'} {...register('password', {required: true})} />
          {errors.password && 'Password is required'}
        </div>

        <div className={classes.control}>
          <label>Confirm Password: </label>
          <input type={'password'}
            {...register('passwordConfirmation', {
              required: true,
              validate: {
                matchesPreviousPassword: (value) => {
                  const {password} = getValues();
                  return password === value || 'Passwords should match!';
                },
              },
            })}
          />
          {errors.passwordConfirmation && 'Password should match!'}
        </div>

        <div className={classes.actions}>
          <button>Create account</button>
        </div>

      </form>
    </Card>
  );
}

export default RegisterForm;
