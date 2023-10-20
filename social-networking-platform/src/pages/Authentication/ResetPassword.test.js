/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import ResetPassword from "./ResetPassword";
import { store } from "../../store/index";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

describe("ResetPassword", () => {
  it("should render the reset password form", () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      </Provider>
    );
    expect(getByPlaceholderText("New Password")).toBeInTheDocument();
    expect(getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(getByText("Update")).toBeInTheDocument();
  });

  it("should update password when the form is submitted", async () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      </Provider>
    );
    const newPasswordInput = getByPlaceholderText("New Password");
    const confirmPasswordInput = getByPlaceholderText("Confirm Password");
    const updateButton = getByText("Update");

    // enter new password and confirm password
    fireEvent.change(newPasswordInput, { target: { value: "newPassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newPassword123" },
    });

    // click update button
    fireEvent.click(updateButton);
  });

  it("should show error message when password does not meet requirements", async () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      </Provider>
    );
    const newPasswordInput = getByPlaceholderText("New Password");
    const confirmPasswordInput = getByPlaceholderText("Confirm Password");
    const updateButton = getByText("Update");

    // enter weak password and confirm password
    fireEvent.change(newPasswordInput, { target: { value: "weakpassword" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "weakpassword" },
    });

    // click update button
    fireEvent.click(updateButton);

    // wait for error message to appear
    await waitFor(() => {
      expect(
        screen.getByText(
          "Password must contain at least 8 characters, including upper/lowercase and numbers"
        )
      ).toBeInTheDocument();
    });
  });

  it("should show error message when confirm password does not match new password", async () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      </Provider>
    );
    const newPasswordInput = getByPlaceholderText("New Password");
    const confirmPasswordInput = getByPlaceholderText("Confirm Password");
    const updateButton = getByText("Update");

    // enter new password and confirm password that do not match
    fireEvent.change(newPasswordInput, { target: { value: "newPassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "differentPassword123" },
    });

    // click update button
    fireEvent.click(updateButton);

    // wait for error message to appear
    await waitFor(() => {
      expect(
        screen.getByText("Confirm password is not same")
      ).toBeInTheDocument();
    });
  });
});
