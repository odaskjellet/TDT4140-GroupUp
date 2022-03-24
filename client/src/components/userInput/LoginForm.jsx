import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../../contexts/User';
import {Alert, Button, Card, Stack, TextField} from '@mui/material';

/**
 * Returns a login form with client side validation.
 * @return {JSX.Element}
 * @constructor
 */
function LoginForm() {
  const [badLogin, setBadLogin] = useState(false);
  const {register, formState: {errors}, handleSubmit} = useForm();
  const navigate = useNavigate();
  const [_, userDispatch] = useContext(UserContext);
  const onSubmit = async (data) => {
    setBadLogin(false);
    fetch('/api/try-login', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        userDispatch({type: 'login', username: data.username});
        navigate('../home');
      } else {
        setBadLogin(true);
      }
    });
  };

  return (
    <Card elevation={5}>
      <form style={{padding: '2rem'}} onSubmit={handleSubmit(onSubmit)}>
        <h2>Login to your account</h2>

        <div>
          <TextField
            required
            fullWidth
            margin="normal"
            error={errors.username}
            helperText={errors.username && 'A username is required.'}
            label="Username"
            inputProps={{'data-testid': 'username-input'}}
            type={'text'}
            {...register('username',
                {required: true, maxLength: 40, pattern: /[A-Za-z]+$/i})
            }
          />
        </div>

        <div>
          <TextField
            required
            fullWidth
            margin="normal"
            error={errors.password}
            helperText={errors.password && 'A password is required.'}
            label="Password"
            inputProps={{'data-testid': 'password-input'}}
            type={'password'}
            {...register('password', {required: true, minLength: 6})}
          />
        </div>

        <br />

        <Stack
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <p>Don't have an account? <a href='/register'>Sign up</a></p>
          {badLogin && <Alert
            severity="error"
            aria-label="errorLogin"
            label="errorLogin"
            onClose={() => setBadLogin(false)}
          >
            Wrong username or password!
          </Alert>}
          <Button
            aria-label="Button"
            data-testid="login-button"
            variant="contained"
            type="submit"
          >
            Login
          </Button>
        </Stack>
      </form>
    </Card>
  );
}


export default LoginForm;
