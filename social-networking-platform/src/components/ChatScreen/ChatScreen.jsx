import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import io from "socket.io-client";
import { connect, useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ChatCard from "../ChatCard/ChatCard";
import Dropzone from "react-dropzone";
import Axios from "axios";
import { afterPostMessage, getChats } from "../../redux/action/ChatAction";
import { Icon } from "@ant-design/compatible";

const ChatScreen = ({ chats }) => {
  const [chatMessage, setChatMessage] = useState("");

  const { user } = useSelector((state) => state.authReducer.data);

  const dispatch = useDispatch();

  const socketRef = useRef();

  useEffect(() => {
    const server = "http://localhost:8080";

    dispatch(getChats());

    socketRef.current = io(server);

    socketRef.current.on("Output Chat Message", (messageFromBackEnd) => {
      console.log(messageFromBackEnd);
      dispatch(afterPostMessage(messageFromBackEnd));
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [dispatch]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const handleSearchChange = (e) => {
    setChatMessage(e.target.value);
  };

  const renderCards = () =>
    chats.chats &&
    chats.chats.map((chat) => <ChatCard key={chat._id} {...chat} />);

  const onDrop = (files) => {
    console.log(files);

    if (user.userData && !user.userData.isAuth) {
      return alert("Please log in first");
    }

    const formData = new FormData();

    const config = {
      header: { "content-type": "multipart/form-data" },
    };

    formData.append("file", files[0]);

    Axios.post(
      "http://localhost:8080/api/chat/uploadfiles",
      formData,
      config
    ).then((response) => {
      if (response.data.success) {
        const chatMessage = response.data.url;
        const userId = user._id;
        const userName = user.name;
        const userImage = user.image;
        const nowTime = moment();
        const type = "VideoOrImage";

        socketRef.current.emit("Input Chat Message", {
          chatMessage,
          userId,
          userName,
          userImage,
          nowTime,
          type,
        });
      }
    });
  };

  const submitChatMessage = (e) => {
    e.preventDefault();

    const userId = user._id;
    const userName = user.name;
    const userImage = user.image;
    const nowTime = moment();
    const type = "Text";

    socketRef.current.emit("Input Chat Message", {
      chatMessage,
      userId,
      userName,
      userImage,
      nowTime,
      type,
    });
    setChatMessage("");
  };

  return (
    <>
      <div>
        <p style={{ fontSize: "2rem", textAlign: "center" }}> Real Time Chat</p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div
          className="infinite-container"
          style={{ height: "500px", overflowY: "scroll" }}
        >
          {chats && renderCards()}
          <div ref={messagesEndRef} style={{ float: "left", clear: "both" }} />
        </div>

        <Row>
          <Form layout="inline" onSubmit={submitChatMessage}>
            <Col span={18}>
              <Input
                id="message"
                prefix={
                  <Icon type="message" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Let's start talking"
                type="text"
                value={chatMessage}
                onChange={handleSearchChange}
              />
            </Col>
            <Col span={2}>
              <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Button>
                        <Icon type="upload" />
                      </Button>
                    </div>
                  </section>
                )}
              </Dropzone>
            </Col>

            <Col span={4}>
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={submitChatMessage}
                htmlType="submit"
              >
                <Icon type="enter" />
              </Button>
            </Col>
          </Form>
        </Row>
      </div>
    </>
  );
};

export default ChatScreen;
