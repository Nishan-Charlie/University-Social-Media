import React from "react";
import moment from "moment";
import { Tooltip, Avatar } from "antd";
import { Comment } from "@ant-design/compatible";

const ChatCard = (props) => {
  const { sender, message } = props;

  const content =
    message.substring(0, 8) === "uploads/" ? (
      // this will be either video or image
      message.substring(message.length - 3, message.length) === "mp4" ? (
        <video
          style={{ maxWidth: "200px" }}
          src={`http://localhost:8080/${message}`}
          alt="video"
          type="video/mp4"
          controls
        />
      ) : (
        <img
          style={{ maxWidth: "200px" }}
          src={`http://localhost:8080/${message}`}
          alt="img"
        />
      )
    ) : (
      <p>{message}</p>
    );

  return (
    <div style={{ width: "100%" }}>
      <Comment
        author={sender.name}
        avatar={<Avatar src={sender.image} alt={sender.name} />}
        content={content}
        datetime={
          <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
            <span>{moment().fromNow()}</span>
          </Tooltip>
        }
      />
    </div>
  );
};

export default ChatCard;
