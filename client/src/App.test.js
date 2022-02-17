import {render, screen} from '@testing-library/react';
import App from './App';
import {BrowserRouter} from 'react-router-dom';

test('renders login', () => {
  render(
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  );
  const loginText = screen.getByText(/login/i);
  expect(loginText).toBeInTheDocument();
});
