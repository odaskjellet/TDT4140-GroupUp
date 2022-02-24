import React, {useState} from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import App from '../App';
import {BrowserRouter} from 'react-router-dom';
import {act} from 'react-dom/test-utils';


test('renders login', () => {
  act(() => {
    render(
        <BrowserRouter>
          <App/>
        </BrowserRouter>,
    );
  });
  // make assertions
  const userInput = screen.getByLabelText('Username');
  const passwordInput = screen.getByLabelText('Password');

  fireEventchange.(userInput, {target: {value: '123'}});

  expect(userInput.value).toBe('23');
});
