import {useForm} from 'react-hook-form';
import Card from '../../ui/Card';
import classes from './LoginForm.module.css';


/**
 * Returns a register form wrapped in custom card div.
 * @return {JSX.Element}
 * @constructor
 */
function RegisterForm() {
  const {register, formState: {errors}, handleSubmit} = useForm();
  const onSubmit = (data) => console.log(data);


  return (
    <Card>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.control}>
          <label htmlFor={'name'}>Your name</label>
          <input {...register('name', {required: true, maxLength: 40, pattern: /^[a-z ,.'-]+$/i})} />
          {errors.name?.type === 'required' && 'Name is required'}
        </div>

        <div className={classes.control}>
          <label htmlFor={'name'}>Your age</label>
          <input type="number" {...register('age', {required: true, min: 18, max: 99})} />
          {errors.age && 'You need to be between 18 and 99 years old.'}
        </div>

        <div className={classes.control}>
          <label htmlFor={'name'}>Your gender</label>
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
          <label htmlFor={'password'}>Repeat password</label>
          <input type={'password'} {...register('passwordRepeat', {required: true})} />
          {errors.passwordRepeat && 'Repeat your password'}
        </div>

        <div className={classes.actions}>
          <button>Create account</button>
        </div>

      </form>
    </Card>
  );
}

export default RegisterForm;
