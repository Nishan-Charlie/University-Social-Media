/* eslint-disable testing-library/prefer-screen-queries */
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ContentShare from "./ContentShare";
import { render, fireEvent, screen } from "@testing-library/react";
import thunk from "redux-thunk";
const mockStore = configureStore([thunk]);

describe("ContentShare component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      authReducer: {
        data: {
          user: {
            _id: "test-user-id",
            username: "test-username",
            profilePicture: "",
          },
        },
      },
      contentReducer: { loading: false },
    });
  });

  it("should render properly", () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <ContentShare />
      </Provider>
    );

    expect(
      getByPlaceholderText("What's on your mind, test-username ?")
    ).toBeInTheDocument();
    expect(getByText("Photo")).toBeInTheDocument();
    expect(getByText("Video")).toBeInTheDocument();
    expect(getByText("Publish")).toBeInTheDocument();
  });

  it("should upload a photo when clicking the 'Photo' button", () => {
    const { getByText, getByLabelText } = render(
      <Provider store={store}>
        <ContentShare />
      </Provider>
    );

    const input = screen.getByRole("span", { name: /Photo/i });
    const photo = new File(["photo-content"], "photo.png", {
      type: "image/png",
    });
    fireEvent.change(input, { target: { files: [photo] } });
    expect(input.files[0]).toBe(photo);

    fireEvent.click(getByText("Publish"));
    // expect the photo to be uploaded successfully and a success message to appear
  });

  it("should upload a video when clicking the 'Video' button", () => {
    const { getByText, getByLabelText } = render(
      <Provider store={store}>
        <ContentShare />
      </Provider>
    );

    const input = screen.getByRole("span", { name: /Video/i });
    const video = new File(["video-content"], "video.mp4", {
      type: "video/mp4",
    });
    fireEvent.change(input, { target: { files: [video] } });
    expect(input.files[0]).toBe(video);

    fireEvent.click(getByText("Publish"));
    // expect the video to be uploaded successfully and a success message to appear
  });

  it("should show a warning message if trying to publish without any content", () => {
    const { getByText } = render(
      <Provider store={store}>
        <ContentShare />
      </Provider>
    );

    fireEvent.click(getByText("Publish"));
    expect(getByText("Write something!")).toBeInTheDocument();
  });

  it("should show a loading message while uploading", () => {
    const { getByText, getByLabelText } = render(
      <Provider store={store}>
        <ContentShare />
      </Provider>
    );

    const input = screen.getByRole("span", { name: /Photo/i });
    const photo = new File(["photo-content"], "photo.png", {
      type: "image/png",
    });
    fireEvent.change(input, { target: { files: [photo] } });

    fireEvent.click(getByText("Publish"));
    expect(getByText("Uploading in progress...")).toBeInTheDocument();
  });
});
