import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app home content', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /grow smarter with ai crop recommendations\./i })
  ).toBeInTheDocument();
});
