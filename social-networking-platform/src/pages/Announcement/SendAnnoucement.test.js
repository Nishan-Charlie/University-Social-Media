/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import SendAnnoucementModal from "./SendAnnoucement";

describe("SendAnnoucementModal", () => {
  test("renders SendAnnoucementModal component", async () => {
    const { getByText } = render(
      <SendAnnoucementModal visible={true} onCancel={() => {}} />
    );
    expect(getByText("Announcement")).toBeInTheDocument();
  });

  test('disables the "Send" button if announcement is empty or no followers are selected', async () => {
    const { getByText, getByPlaceholderText } = render(
      <SendAnnoucementModal visible={true} onCancel={() => {}} />
    );
    const sendButton = getByText("Send");
    expect(sendButton).toBeDisabled();

    const announcementInput = getByPlaceholderText("Enter the announcement");
    fireEvent.change(announcementInput, {
      target: { value: "Test announcement" },
    });
    expect(sendButton).toBeDisabled();

    const checkbox = screen.getByRole("checkbox", { name: "All users" });
    fireEvent.click(checkbox);
    expect(sendButton).toBeEnabled();
  });

  test('selects all followers when "All users" checkbox is checked', async () => {
    const { getByText } = render(
      <SendAnnoucementModal visible={true} onCancel={() => {}} />
    );
    const checkbox = screen.getByRole("checkbox", { name: "All users" });
    fireEvent.click(checkbox);
    const sendButton = getByText("Send");
    expect(sendButton).toBeEnabled();
    const followerCheckboxes = screen.getAllByRole("checkbox");
    followerCheckboxes.shift(); // remove the "All users" checkbox
    const allChecked = followerCheckboxes.every((checkbox) => checkbox.checked);
    expect(allChecked).toBe(true);
  });

  // Add more test cases as needed
});
