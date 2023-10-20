import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { BUCKET_URI } from "../../utils/constant";
import { HiLockClosed } from "react-icons/hi";
import { acceptFollowRequest, rejectFollowRequest } from "../../services/User";
import { listAllFollowers } from "../../redux/action/FollowersAction";
import { message } from "antd";

export default function FollowingRequest({
  follower,
  idx,
  listAllFollowRequest,
}) {
  const [messageApi, contextHolder] = message.useMessage();
  const user = useSelector((state) => state.authReducer.data).user;
  const dispatch = useDispatch();

  const handleRequestStatus = async () => {
    messageApi.open({
      type: "loading",
      content: "Loading...",
    });
    const payload = {
      id: follower?._id,
      _id: user?._id,
    };
    try {
      await acceptFollowRequest(payload);
      listAllFollowRequest();
      setTimeout(() => {
        dispatch(listAllFollowers(user?._id));
      }, 500);
      messageApi.destroy();
      messageApi.open({
        type: "success",
        content: "Request accepted.",
      });
    } catch (error) {
      messageApi.destroy();
      console.log({ error });
    }
  };

  const handleReject = async () => {
    messageApi.open({
      type: "loading",
      content: "Loading...",
    });
    const payload = {
      id: follower?._id,
      _id: user?._id,
    };
    try {
      await rejectFollowRequest(payload);
      listAllFollowRequest();
      setTimeout(() => {
        dispatch(listAllFollowers(user?._id));
      }, 500);
      messageApi.destroy();
      messageApi.open({
        type: "success",
        content: "Request rejected.",
      });
    } catch (error) {
      messageApi.destroy();
      console.log({ error });
    }
  };

  return (
    <div
      key={idx}
      style={{
        marginBottom: "1rem",
        marginTop: "1rem",
      }}
      className="follower"
    >
      {contextHolder}
      <div>
        <img
          src={
            follower.profilePicture
              ? BUCKET_URI + follower.profilePicture
              : Images.DEFAULT_PROFILE
          }
          alt="profile"
          className="followerImage"
        />
        <div className="name">
          <span>
            {follower.firstname}{" "}
            {follower?.accountType === "private" && <HiLockClosed />}{" "}
          </span>
          <span>@{follower.username}</span>
        </div>
      </div>
      <div style={{ justifyContent: "flex-end" }}>
        <button
          onClick={handleRequestStatus}
          className={"button fc-button"}
          style={{ width: "38%", fontSize: "0.75rem" }}
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          className={"button fc-button"}
          style={{ width: "38%", fontSize: "0.75rem" }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
