import React from "react";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Authentication from "./Authentication";
import { store } from "../../store/index";
import { BrowserRouter } from "react-router-dom";

describe("Authentication", () => {
  test("renders email input", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Authentication />
        </BrowserRouter>
      </Provider>
    );
    const emailInput = screen.getByPlaceholderText(/Email Address/i);
    expect(emailInput).toBeInTheDocument();
  });

  test("renders password input", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Authentication />
        </BrowserRouter>
      </Provider>
    );
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    expect(passwordInput).toBeInTheDocument();
  });

  test("submits form with valid email and password", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Authentication />
        </BrowserRouter>
      </Provider>
    );
    const emailInput = screen.getByPlaceholderText(/Email Address/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Login/i });

    userEvent.type(emailInput, "test@test.com");
    userEvent.type(passwordInput, "password");
    userEvent.click(submitButton);
  });
});
