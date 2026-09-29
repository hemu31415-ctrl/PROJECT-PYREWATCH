import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Pyrewatch application header", () => {
  render(<App />);
  const titleElement = screen.getByText(/PYREWATCH/i);
  expect(titleElement).toBeInTheDocument();
});
