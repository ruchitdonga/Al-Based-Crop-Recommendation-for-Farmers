import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app home content', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /ai-based crop recommendation system/i })
  ).toBeInTheDocument();
});
