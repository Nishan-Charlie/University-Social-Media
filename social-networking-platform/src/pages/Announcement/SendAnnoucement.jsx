import React from "react";
import { Modal, Checkbox, Row, Col, Input } from "antd";
import { useState } from "react";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { getAllUsers } from "../../services/User";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { createAnnouncement } from "../../services/Announcement";
import {
  getAllAnnouncement,
  openAnnouncementModal,
} from "../../redux/action/AnnouncementAction";

export default function SendAnnoucementModal({ visible, onCancel }) {
  const CheckboxGroup = Checkbox.Group;
  const { TextArea } = Input;

  const [checkedFollowers, setCheckedFollowers] = useState([]);
  const [userData, setuserData] = useState();
  const [announcement, setannouncement] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (e) => {
    const allUserIds = userData.map((user) => user._id);
    setCheckedFollowers(e.target.checked ? allUserIds : []);
    setSelectAll(e.target.checked);
  };

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.authReducer.data);

  const handleCheckboxChange = (checkedValues) => {
    setCheckedFollowers(checkedValues);
  };

  const handleChange = useCallback(
    (e) => {
      setannouncement(e.target.value);
    },
    [setannouncement]
  );

  const closeAnnouncementModal = () => {
    dispatch(openAnnouncementModal(false));
  };

  useEffect(() => {
    const listAllUsers = async () => {
      try {
        const { data } = await getAllUsers(user?.username);
        console.log({ data });
        setuserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    listAllUsers();
  }, []);

  const handleSubmit = async () => {
    console.log({ checkedFollowers });
    try {
      const payload = {
        announcement: announcement,
        users: checkedFollowers,
        senderId: user?._id,
      };
      await createAnnouncement(payload);
      closeAnnouncementModal();
      dispatch(getAllAnnouncement());
      setannouncement("");
      setCheckedFollowers([]);
    } catch (error) {
      console.log({ error });
    }
  };

  const followerList =
    !isEmpty(userData) &&
    userData?.map((user) => (
      <Col span={12}>
        <div
          style={{
            backgroundColor: "#F0F1F1",
            padding: 10,
            marginBottom: 10,
            borderRadius: 12,
            marginRight: "1rem",
            minWidth: "5rem",
          }}
        >
          <Checkbox key={user?._id} value={user?._id}>
            {user?.firstname}
          </Checkbox>
        </div>
      </Col>
    ));

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      okButtonProps={{
        disabled: announcement.trim() === "" || isEmpty(checkedFollowers),
      }}
      okText="Send"
      onOk={handleSubmit}
    >
      <div style={{ fontSize: "15px", marginBottom: "5px" }}>Announcement</div>
      <TextArea
        value={announcement}
        onChange={handleChange}
        placeholder="Enter the announcement"
        autoSize={{
          minRows: 4,
          maxRows: 6,
        }}
        style={{ marginBottom: "1rem" }}
      />

      <Checkbox
        checked={selectAll}
        onChange={handleSelectAll}
        style={{ marginBottom: "1rem", marginLeft: "0.6rem" }}
      >
        All users
      </Checkbox>

      <CheckboxGroup onChange={handleCheckboxChange} value={checkedFollowers}>
        <Row>{followerList}</Row>
      </CheckboxGroup>
    </Modal>
  );
}
