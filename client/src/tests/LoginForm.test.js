import React, {useState} from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import App from '../App';
import {BrowserRouter} from 'react-router-dom';
import {act} from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';


function renderLogin() {
  act(() => {
    render(
        <BrowserRouter>
          <App/>
        </BrowserRouter>,
    );
  });
}

test('renders login', () => {
  renderLogin();

  // Getting inputs
  const userInput = screen.getByTestId('username-input');
  const passwordInput = screen.getByTestId('password-input');
  const buttonInput = screen.getByLabelText('Button');

  // Checks that the text-inputs is in the LoginForm
  expect(userInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(buttonInput).toBeInTheDocument();

  // Simulates a user entering their username
  fireEvent.change(userInput, {target: {value: '123'}});
  expect(userInput.value).toMatch('123');

  // Simulates a user entering their password
  fireEvent.change(passwordInput, {target: {value: 'test'}});
  expect(passwordInput.value).toMatch('test');
});
