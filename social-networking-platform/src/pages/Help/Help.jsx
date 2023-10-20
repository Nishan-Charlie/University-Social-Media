import React from "react";
import { Modal, message, Result, Input } from "antd";
import { useState } from "react";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { getAllUsers } from "../../services/User";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { createAnnouncement } from "../../services/Announcement";
import { openHelpModal } from "../../redux/action/HelpAction";
import { sendHelp } from "../../services/Help";

export default function HelpModal({ visible, onCancel }) {
  const { TextArea } = Input;
  const [question, setQuestion] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.authReducer.data);

  const handleChange = useCallback(
    (e) => {
      setQuestion(e.target.value);
    },
    [setQuestion]
  );

  const closeHelpModal = () => {
    dispatch(openHelpModal(false));
  };

  const handleSubmit = async () => {
    const payload = {
      firstname: user?.firstname,
      email: user?.email,
      question: question,
    };
    try {
      await sendHelp(payload);
      closeHelpModal();
      setQuestion("");
    } catch (error) {}
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      okButtonProps={{
        disabled: question.trim() === "",
      }}
      okText="Send"
      onOk={handleSubmit}
    >
      <Result
        status="404"
        title="uconnect.albany@gmail.com"
        subTitle="Get in touch and let us know how we can help."
      />
      <div style={{ fontSize: "15px", marginBottom: "5px" }}>Question</div>
      <TextArea
        value={question}
        onChange={handleChange}
        placeholder="How can we help you?"
        autoSize={{
          minRows: 4,
          maxRows: 6,
        }}
        style={{ marginBottom: "1rem" }}
      />
    </Modal>
  );
}
