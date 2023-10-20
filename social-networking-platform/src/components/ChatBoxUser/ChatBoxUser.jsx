import React from "react";
import { Images } from "../../assets/images";
import { BUCKET_URI } from "../../utils/constant";
import { IoEllipseSharp } from "react-icons/io5";
const ChatBoxUser = ({ data, currentUser, online, userData, selectedUser }) => {
  console.log({ selectedUser });
  console.log({ userData });
  return (
    <>
      <div
        style={{
          backgroundColor: selectedUser?._id === userData?._id ? "#c796e5" : "",
        }}
        className="follower conversation"
      >
        <div>
          <img
            src={
              userData?.profilePicture
                ? BUCKET_URI + userData.profilePicture
                : Images.DEFAULT_PROFILE
            }
            alt="Profile"
            className="followerImage"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="name" style={{ fontSize: "0.7rem" }}>
            <span>
              {userData?.username}{" "}
              {online && <IoEllipseSharp color="green" size={8} />}
            </span>
            <span style={{ color: online ? "green" : "" }}>
              {online ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
      <hr style={{ width: "50%", border: "0.1px solid #c796e5" }} />
    </>
  );
};

export default ChatBoxUser;
