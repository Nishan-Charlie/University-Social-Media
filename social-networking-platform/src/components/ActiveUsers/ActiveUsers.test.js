import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import ActiveUsers from "./ActiveUsers";
import { deleteUser } from "../../services/User";
import { jest } from "@jest/globals";

jest.mock("../../services/User");

const mockStore = configureMockStore([thunk]);

describe("ActiveUsers component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      authReducer: {
        data: {
          user: {
            _id: "user_id_1",
          },
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the follower's name and username", () => {
    const follower = {
      _id: "follower_id_1",
      firstname: "John",
      username: "john_doe",
    };
    const idx = 0;
    render(
      <Provider store={store}>
        <ActiveUsers follower={follower} idx={idx} />
      </Provider>
    );
    expect(screen.getByText(follower.firstname)).toBeInTheDocument();
    expect(screen.getByText(`@${follower.username}`)).toBeInTheDocument();
  });

  test("clicking on the 'Delete user' button opens the modal", () => {
    const follower = {
      _id: "follower_id_1",
      firstname: "John",
      username: "john_doe",
    };
    const idx = 0;
    render(
      <Provider store={store}>
        <ActiveUsers follower={follower} idx={idx} />
      </Provider>
    );
    const deleteButton = screen.getByText("Delete user");
    fireEvent.click(deleteButton);
    expect(screen.getByText("Remove user")).toBeInTheDocument();
  });

  test("entering a reason and clicking the 'OK' button calls the deleteUser function and closes the modal", async () => {
    const follower = {
      _id: "follower_id_1",
      firstname: "John",
      username: "john_doe",
    };
    const idx = 0;
    render(
      <Provider store={store}>
        <ActiveUsers follower={follower} idx={idx} />
      </Provider>
    );
    const deleteButton = screen.getByText("Delete user");
    fireEvent.click(deleteButton);
    const reasonInput = screen.getByPlaceholderText("Enter the reason");
    const reason = "This user is a spammer";
    fireEvent.change(reasonInput, { target: { value: reason } });
    const okButton = screen.getByRole("button", { name: "OK" });
    fireEvent.click(okButton);
    expect(deleteUser).toHaveBeenCalledWith(follower._id, reason);
    expect(screen.queryByText("Remove user")).not.toBeInTheDocument();
  });

  test("clicking the 'Cancel' button closes the modal without deleting the user", () => {
    const follower = {
      _id: "follower_id_1",
      firstname: "John",
      username: "john_doe",
    };
    const idx = 0;
    render(
      <Provider store={store}>
        <ActiveUsers follower={follower} idx={idx} />
      </Provider>
    );
    const deleteButton = screen.getByText("Delete user");
    fireEvent.click(deleteButton);
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
    expect(deleteUser).not.toHaveBeenCalled();
    expect(screen.queryByText("Remove user")).not.toBeInTheDocument();
  });
});
