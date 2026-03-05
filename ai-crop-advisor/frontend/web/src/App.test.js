import { render, screen } from "@testing-library/react";

import App from "./App";
import { LanguageProvider } from "./i18n/LanguageContext";

test('renders app home content', () => {
  window.localStorage.setItem("cropAdvisor.lang", "en");
  render(
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
  expect(
    screen.getByRole('heading', { name: /grow smarter with ai crop recommendations\./i })
  ).toBeInTheDocument();
});
