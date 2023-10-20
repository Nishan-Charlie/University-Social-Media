/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-container */
import React from "react";
import { render } from "@testing-library/react";
import ChatBoxUser from "./ChatBoxUser";

describe("ChatBoxUser", () => {
  const userData = {
    _id: "1",
    username: "John",
    profilePicture: "john.png",
  };
  const selectedUser = {
    _id: "1",
  };
  const currentUser = {
    _id: "2",
  };

  test("renders user data correctly", () => {
    const { getByText, getByAltText } = render(
      <ChatBoxUser
        data={{}}
        currentUser={currentUser}
        online={true}
        userData={userData}
        selectedUser={selectedUser}
      />
    );
    const usernameElement = getByText(/John/);
    const onlineElement = getByText(/Online/);
    const imageElement = getByAltText(/Profile/);

    expect(usernameElement).toBeInTheDocument();
    expect(onlineElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute(
      "src",
      "http://localhost:8080/images/john.png"
    );
  });

  test("renders offline status when online prop is false", () => {
    const { getByText } = render(
      <ChatBoxUser
        data={{}}
        currentUser={currentUser}
        online={false}
        userData={userData}
        selectedUser={selectedUser}
      />
    );
    const offlineElement = getByText(/Offline/);

    expect(offlineElement).toBeInTheDocument();
  });

  test("renders online status when online prop is true", () => {
    const { getByText } = render(
      <ChatBoxUser
        data={{}}
        currentUser={currentUser}
        online={true}
        userData={userData}
        selectedUser={selectedUser}
      />
    );
    const onlineElement = getByText(/Online/);

    expect(onlineElement).toBeInTheDocument();
  });

  test("renders selected user with different background color", () => {
    const { container } = render(
      <ChatBoxUser
        data={{}}
        currentUser={currentUser}
        online={true}
        userData={userData}
        selectedUser={selectedUser}
      />
    );
    // eslint-disable-next-line testing-library/no-node-access
    const followerConversation = container.querySelector(
      ".follower.conversation"
    );

    expect(followerConversation).toHaveStyle("background-color: #c796e5");
  });

  test("renders unselected user with default background color", () => {
    const { container } = render(
      <ChatBoxUser
        data={{}}
        currentUser={currentUser}
        online={true}
        userData={{ _id: "2", username: "Bob" }}
        selectedUser={selectedUser}
      />
    );
    // eslint-disable-next-line testing-library/no-node-access
    const followerConversation = container.querySelector(
      ".follower.conversation"
    );

    expect(followerConversation).not.toHaveStyle("background-color: #c796e5");
  });
});
