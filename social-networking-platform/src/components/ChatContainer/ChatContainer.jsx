import React, { useRef, useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import ChatBoxUser from "../ChatBoxUser/ChatBoxUser";
import "./style.css";
import { useEffect } from "react";
import { userChats } from "../../services/Chat/ChatRequest";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import axios from "axios";
import { API_URI } from "../../utils/constant";
import _ from "lodash";

const socket = io("http://localhost:8080");

const ChatContainer = () => {
  const { user } = useSelector((state) => state.authReducer.data);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [currentSelected, setCurrentSelected] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Get the chat in chat section

  const getUsers = async (username) => {
    axios
      .get(`${API_URI}/user/getothers/${user?._id}/${username}`, {
        headers: { "Access-Control-Allow-Origin": "*" },
      })
      .then((res) => {
        console.log({ res });
        setChatUsers(res.data);
        setCurrentSelected(res.data[0]);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  useEffect(() => {
    getUsers("");
  }, [user]);
  console.log(chatUsers);

  useEffect(() => {
    if (user) {
      socket.on("online-users", (users) => {
        console.log("++++++++", users);
        setOnlineUsers(users);
      });
    }
  }, [user]);

  const changeCurrentChat = (index, user) => {
    console.log(user);
    setCurrentSelected(user);
  };

  const checkOnlineStatus = (data) => {
    console.log("chat", data);
    console.log("onlineUsers", onlineUsers);
    const online = onlineUsers.find((user) => user.userId === data?._id);
    return online ? true : false;
  };

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <input
          className="chat-user-search"
          type="text"
          placeholder=" Search"
          required
          onChange={(e) => getUsers(e.target.value)}
        />
        <div className="left-side-inner">
          {!_.isEmpty(chatUsers) &&
            chatUsers.map((user, index) => (
              <div
                onClick={() => {
                  changeCurrentChat(index, user);
                }}
              >
                <ChatBoxUser
                  online={checkOnlineStatus(user)}
                  userData={user}
                  currentUser={user._id}
                  change
                  selectedUser={currentSelected}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Right Side */}

      <div className="Right-side-chat">
        <ChatBox
          chat={currentSelected}
          currentUser={user._id}
          receivedMessage={receivedMessage}
          online={checkOnlineStatus(user)}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
