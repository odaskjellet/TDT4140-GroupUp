import {render, unmountComponentAtNode} from 'react-dom';
import {screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import RegisterForm from '../components/userInput/RegisterForm';
import React from 'react';
import {UserProvider} from '../contexts/User';
import userEvent from '@testing-library/user-event';


let container = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);

  act(() => {
    render(<BrowserRouter>
      <UserProvider>
        <RegisterForm/>
      </UserProvider>
    </BrowserRouter>, container);
  });
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});


test('Checks that user input fields are in the document', () => {
  const userInput = screen.getByTestId('username-input');
  const passwordInput = screen.getByTestId('password-input');
  const emailInput = screen.getByTestId('email-input');
  const button = screen.getByLabelText('button-input');
  const ageInput = screen.getByTestId('age-input');


  expect(userInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(button).toBeInTheDocument();
  expect(ageInput).toBeInTheDocument();
});

test('Checks that user input fields are mutable', () => {
  const userInput = screen.getByTestId('username-input');
  const passwordInput = screen.getByTestId('password-input');
  const emailInput = screen.getByTestId('email-input');
  const ageInput = screen.getByTestId('age-input');

  userEvent.type(userInput, '123');
  expect(userInput.value).toMatch('123');

  userEvent.type(passwordInput, '123');
  expect(passwordInput.value).toMatch('123');

  userEvent.type(emailInput, '123');
  expect(emailInput.value).toMatch('123');

  userEvent.type(ageInput, '18');
  expect(ageInput.value).toMatch('18');
});


