import React, { useEffect, useState } from "react";
import { useRef } from "react";
import "./style.css";
import InputEmoji from "react-input-emoji";
import axios from "axios";
import { API_URI, BUCKET_URI } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { io } from "socket.io-client";
import { AiOutlineClose } from "react-icons/ai";
import { openChatBox } from "../../redux/action/MessageAction";
import {
  Direction,
  FloatMenuItemButton,
  FloatingGroup,
  Size,
} from "react-motion-float-button";
import {
  VideoCameraAddOutlined,
  CameraOutlined,
  SendOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { BsCloudDownload } from "react-icons/bs";

const socket = io("http://localhost:8080");

const ChatBox = ({ chat, currentUser, setSendMessage, online }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isFile, setisFile] = useState(false);

  const scroll = useRef();
  const imageRef = useRef();
  const videoRef = useRef();
  const docsRef = useRef();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.authReducer.data);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMsg = async () => {
    socket.emit("send-msg", {
      to: chat._id,
      from: user._id,
      newMessage: newMessage,
    });
    await axios.post(`${API_URI}/message/addmsg`, {
      from: user._id,
      to: chat?._id,
      message: newMessage,
      type: isFile ? "docs" : "text",
    });

    const msgs = [...messages];
    msgs.push({
      fromSelf: true,
      message: newMessage,
      type: isFile ? "docs" : "text",
    });
    setMessages(msgs);
    setNewMessage("");
    setisFile(false);
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEnterMsg = async (e) => {
    if (e.key === "Enter") {
      socket.emit("send-msg", {
        to: chat._id,
        from: user._id,
        newMessage: newMessage,
        type: isFile ? "docs" : "text",
      });
      await axios.post(`${API_URI}/message/addmsg`, {
        from: user._id,
        to: chat?._id,
        message: newMessage,
        type: isFile ? "docs" : "text",
      });

      const msgs = [...messages];
      msgs.push({
        fromSelf: true,
        message: newMessage,
        type: isFile ? "docs" : "text",
      });
      setMessages(msgs);
      setNewMessage("");
      setisFile(false);
    }
  };

  const getCurrentMessages = async () => {
    const response = await axios.post(`${API_URI}/message/getmsg`, {
      from: user._id,
      to: chat?._id,
    });
    setMessages(response.data);
  };
  useEffect(() => {
    getCurrentMessages();
  }, [chat]);

  useEffect(() => {
    if (user) {
      socket.emit("add-user", user._id);
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("msg-recieve", (msg) => {
        console.log(msg);
        setArrivalMessage({
          fromSelf: false,
          message: msg.msg,
          type: msg.type,
        });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  const closeDrawer = () => {
    dispatch(openChatBox(false));
  };

  const onDrop = (files) => {
    const formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };

    formData.append("file", files[0]);

    axios
      .post("http://localhost:8080/api/chat/uploadfiles", formData, config)
      .then((response) => {
        if (response.data.success) {
          setNewMessage(response.data.url);
          setisFile(true);
        }
      });
  };

  // function isPdf(url) {
  //   return url.endsWith(".pdf");
  // }

  function isPdfOrDoc(url) {
    return (
      url.endsWith(".pdf") || url.endsWith(".doc") || url.endsWith(".docx")
    );
  }

  const content = (data) => {
    return data?.type === "docs" ? (
      data?.message.substring(
        data?.message.length - 3,
        data?.message.length
      ) === "mp4" ? (
        <video
          style={{ maxWidth: "200px" }}
          src={BUCKET_URI + data?.message}
          alt="video"
          type="video/mp4"
          controls
        />
      ) : isPdfOrDoc(data?.message) ? (
        // eslint-disable-next-line jsx-a11y/anchor-has-content, react/jsx-no-target-blank
        <a
          style={{
            maxWidth: "200px",
            color: "#fff",
            display: "flex",
            textAlign: "center",
          }}
          href={BUCKET_URI + data?.message}
          alt="pdf"
          target="_blank"
        >
          <BsCloudDownload style={{ fontSize: 20, marginRight: 5 }} />
          {data?.message?.split("_")[1]}{" "}
        </a>
      ) : (
        <>
          {console.log(
            "BUCKET_URI + data?.message",
            BUCKET_URI + data?.message
          )}
          <img
            style={{ maxWidth: "200px", borderRadius: "0.5rem" }}
            src={BUCKET_URI + data?.message}
            alt="img"
          />
        </>
      )
    ) : (
      <p>{data?.message}</p>
    );
  };

  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            {/* chat-header */}
            <div
              style={{
                borderBottom: "1px solid #E0E1E3",
              }}
              className="chat-header"
            >
              <div className="follower">
                <div>
                  <img
                    src={
                      chat?.profilePicture
                        ? BUCKET_URI + chat.profilePicture
                        : Images.DEFAULT_PROFILE
                    }
                    alt="Profile"
                    className="followerImage"
                    style={{
                      width: "30px",
                      height: "30px",
                    }}
                  />
                  <div className="conversation-name">
                    <span className="conversation-with">
                      Conversation with &nbsp;
                    </span>
                    <span className="conversation-with-name">
                      {chat?.username}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <AiOutlineClose
                  onClick={closeDrawer}
                  style={{ cursor: "pointer" }}
                  size={18}
                />
              </div>
            </div>
            {/* chat-body */}
            <div className="chat-body">
              {messages.map((message) => (
                <>
                  <div
                    ref={scroll}
                    style={{
                      minHeight: message.type === "docs" ? "" : "2rem",
                      display: message.type === "docs" ? "" : "flex",
                      alignItems: message.type === "docs" ? "" : "center",
                      justifyContent: message.type === "docs" ? "" : "center",
                      paddingTop: message.type === "docs" ? "0.5rem" : "0.2rem",
                      paddingBottom:
                        message.type === "docs" ? "0.5rem" : "0.2rem",
                    }}
                    className={message.fromSelf ? "message own" : "message"}
                  >
                    {content(message)}
                  </div>
                </>
              ))}
            </div>
            {/* chat-sender */}
            <div className="chat-sender">
              <FloatingGroup size={Size.SMALL} direction={Direction.TOP}>
                <FloatMenuItemButton
                  icon={
                    <CameraOutlined style={{ cursor: "pointer" }} size="60%" />
                  }
                  buttonColor="#00ACEE"
                  onClick={() => imageRef.current.click()}
                />

                <FloatMenuItemButton
                  icon={
                    <VideoCameraAddOutlined
                      style={{ cursor: "pointer" }}
                      size="60%"
                    />
                  }
                  buttonColor="#4f5bd5"
                  onClick={() => videoRef.current.click()}
                />
                <FloatMenuItemButton
                  icon={
                    <FilePdfOutlined style={{ cursor: "pointer" }} size="60%" />
                  }
                  buttonColor="#00ACEE"
                  onClick={() => docsRef.current.click()}
                />
              </FloatingGroup>
              {/* </div> */}

              <InputEmoji
                onKeyDown={handleEnterMsg}
                value={newMessage}
                onChange={handleChange}
              />
              <div
                style={{ width: "4rem", height: "2.5rem" }}
                className="send-button button"
                onClick={handleSendMsg}
              >
                <SendOutlined />
              </div>
              <input
                type="file"
                name=""
                id=""
                style={{ display: "none" }}
                ref={imageRef}
                accept="image/*"
                onChange={(e) => {
                  onDrop(e.target.files);
                }}
              />
              <input
                type="file"
                name=""
                id=""
                style={{ display: "none" }}
                ref={videoRef}
                accept="video/*"
                onChange={(e) => {
                  onDrop(e.target.files);
                }}
              />
              <input
                type="file"
                name=""
                id=""
                style={{ display: "none" }}
                ref={docsRef}
                accept=".doc,.docx,.pdf,application/pdf"
                onChange={(e) => {
                  onDrop(e.target.files);
                }}
              />
            </div>{" "}
          </>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
