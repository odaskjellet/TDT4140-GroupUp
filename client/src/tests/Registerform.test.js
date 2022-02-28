import {render, unmountComponentAtNode} from 'react-dom';
import {screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import RegisterForm from '../components/userInput/RegisterForm';
import React from 'react';
import {UserProvider} from '../contexts/User';


let container = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
  render(<BrowserRouter>
    <UserProvider>
      <RegisterForm/>
    </UserProvider>
  </BrowserRouter>, container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});


test('renders with or without a name', () => {
  const userInput = screen.getByTestId('username-register');
  const passwordInput = screen.getByTestId('password-register');
  const emailInput = screen.getByTestId('email-register');

  expect(userInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
});
