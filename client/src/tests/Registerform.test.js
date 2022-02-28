import {render, unmountComponentAtNode} from 'react-dom';
import {screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import RegisterForm from '../components/userInput/RegisterForm';
import React from 'react';


let container = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
  render(<BrowserRouter>
    <RegisterForm/>
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
  const passwordInput = screen.getByLabelText('password-register');
  const emailInput = screen.getByTestId('email-register');

  expect(userInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
});
