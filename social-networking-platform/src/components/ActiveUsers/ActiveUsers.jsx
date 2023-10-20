/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { BUCKET_URI } from "../../utils/constant";
import { Typography, message, Modal, Input } from "antd";
import { deleteUser } from "../../services/User";
import { listAllSuggestedPerson } from "../../redux/action/SuggestedPersonAction";
import { getTimeline } from "../../redux/action/ContentAction";
import { WarningOutlined } from "@ant-design/icons";

function ActiveUsers({ follower, idx }) {
  console.log({ follower });
  const user = useSelector((state) => state.authReducer.data).user;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { Paragraph } = Typography;
  const { TextArea } = Input;

  const [reason, setReason] = useState("");
  const [reasonPop, setreasonPop] = useState(false);

  const handleChange = useCallback(
    (e) => {
      setReason(e.target.value);
    },
    [setReason]
  );

  const removeUser = async () => {
    messageApi.open({
      type: "loading",
      content: "Action in progress..",
    });
    try {
      await deleteUser(follower?._id, reason);
      messageApi.destroy();
      messageApi.success({
        type: "success",
        content: `User deleted successfully!`,
      });
      dispatch(listAllSuggestedPerson({ userId: user?._id }));
      const payload = {
        id: "",
        department: "",
        yearOfStudy: "",
        loggedInUser: user?._id,
      };
      dispatch(getTimeline(payload));
    } catch (error) {
      messageApi.destroy();
    }
  };

  const handleReasonOk = () => {
    removeUser();
    setreasonPop(false);
    setReason("");
  };

  const handleReasonCancel = () => {
    setreasonPop(false);
  };

  return (
    <div
      key={idx}
      style={{ marginBottom: "1rem", marginTop: "1rem" }}
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
          <span>{follower.firstname} </span>
          <span>@{follower.username}</span>
        </div>
      </div>
      <div>
        {/* <Popconfirm
          title="Delete the user"
          description="Are you sure to delete this user?"
          onConfirm={removeUser}
          okText="Yes"
          cancelText="No"
          placement="leftTop"
        > */}
        <div
          onClick={() => setreasonPop(true)}
          style={{ color: "red", fontWeight: "600", cursor: "pointer" }}
        >
          Delete user
        </div>
        {/* </Popconfirm> */}
      </div>
      <Modal
        title="Remove user"
        open={reasonPop}
        onOk={handleReasonOk}
        onCancel={handleReasonCancel}
        okButtonProps={{ disabled: reason.trim() === "" }}
      >
        <div style={{ marginTop: "1rem" }}>
          <Paragraph>
            <WarningOutlined style={{ color: "red" }} /> When a user is deleted,
            <span style={{ color: "red" }}>
              {" "}
              all their associated content will be delete!
            </span>
          </Paragraph>
          <div style={{ fontSize: "15px", marginBottom: "5px" }}>Reason</div>
          <TextArea
            value={reason}
            onChange={handleChange}
            placeholder="Enter the reason"
            autoSize={{
              minRows: 3,
              maxRows: 5,
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default React.memo(ActiveUsers);
