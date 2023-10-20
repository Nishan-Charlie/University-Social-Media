import React from "react";
import { render, screen } from "@testing-library/react";
import ChatCard from "./ChatCard";

describe("ChatCard", () => {
  const sender = {
    name: "John Doe",
    image: "http://example.com/avatar.png",
  };

  it("should render text message", () => {
    const message = "Hello World!";
    render(<ChatCard sender={sender} message={message} />);
    const messageElement = screen.getByText(message);
    expect(messageElement).toBeInTheDocument();
  });

  it("should render image message", () => {
    const message = "uploads/image.png";
    render(<ChatCard sender={sender} message={message} />);
    const imageElement = screen.getByAltText("img");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.getAttribute("src")).toBe(
      "http://localhost:8080/uploads/image.png"
    );
  });

  it("should render video message", () => {
    const message = "uploads/video.mp4";
    render(<ChatCard sender={sender} message={message} />);
    const videoElement = screen.getByTitle("video");
    expect(videoElement).toBeInTheDocument();
    expect(videoElement.getAttribute("src")).toBe(
      "http://localhost:8080/uploads/video.mp4"
    );
  });

  it("should render sender name and avatar", () => {
    render(<ChatCard sender={sender} message="Hello World!" />);
    const nameElement = screen.getByText(sender.name);
    const avatarElement = screen.getByAltText(sender.name);
    expect(nameElement).toBeInTheDocument();
    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement.getAttribute("src")).toBe(sender.image);
  });

  it("should render relative timestamp", () => {
    render(<ChatCard sender={sender} message="Hello World!" />);
    const timestampElement = screen.getByText(/ago/i);
    expect(timestampElement).toBeInTheDocument();
  });
});
