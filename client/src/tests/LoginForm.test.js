import React from 'react';
import {render, screen} from '@testing-library/react';
import App from '../App';
import {BrowserRouter} from 'react-router-dom';
import {act} from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import {unmountComponentAtNode} from 'react-dom';
import LoginForm from '../components/userInput/LoginForm';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);

  act(() => {
    render(
        <BrowserRouter>
          <App>
            <LoginForm/>
          </App> </BrowserRouter>
        , container);
  });
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});


test('Inputs are present in the document', () => {
  // Getting inputs
  const userInput = screen.getByTestId('username-input');
  const passwordInput = screen.getByTestId('password-input');
  const buttonInput = screen.getByTestId('login-button');

  // Checks that the text-inputs is in the LoginForm
  expect(userInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(buttonInput).toBeInTheDocument();
});

test('inputs are mutable', () => {
  // Getting inputs
  const userInput = screen.getByTestId('username-input');
  const passwordInput = screen.getByTestId('password-input');
  // Simulates a user entering their username
  // Asserts that the value we set matches.

  userEvent.type(userInput, '123');
  expect(userInput.value).toMatch('123');

  // Simulates a user entering their password
  // Asserts that the value we set matches.

  userEvent.type(passwordInput, '123');
  expect(passwordInput.value).toMatch('123');
});


