import { Col, Drawer, Row, Space } from "antd";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatContainer from "../../components/ChatContainer/ChatContainer";
import PostContainer from "../../components/ContentContainer/ContentContainer";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import RightContainer from "../../components/RightContainer/RightContainer";
import { openChatBox } from "../../redux/action/MessageAction";
import "./style.css";
import {
  openAskQuestionModal,
  openForumAnswerDrawer,
  openForumDrawer,
} from "../../redux/action/ForumModalAction";
import Button from "antd/lib/button";
import { useState } from "react";
import Forum from "../../components/Forum/Forum";
import ForumAnswers from "../../components/Forum/ForumAnswers";
import { Input, message } from "antd";
import { postAnswer, publishQuestion } from "../../services/Forum";
import {
  getAllQuestions,
  getAnswerByQuestion,
} from "../../redux/action/ForumAction";
import AskQuestion from "../../components/Forum/AskQuestion";
import SendAnnoucementModal from "../Announcement/SendAnnoucement";
import { openAnnouncementModal } from "../../redux/action/AnnouncementAction";
import { listAllNotifications } from "../../redux/action/NotificationAction";
import { openHelpModal } from "../../redux/action/HelpAction";
import HelpModal from "../Help/Help";
import { sendHelp } from "../../services/Help";

const Dashboard = () => {
  const { TextArea } = Input;

  const { isOpenChatbox } = useSelector((state) => state.messageReducer);
  const { showAnnouncementModal } = useSelector(
    (state) => state.announcementReducer
  );
  const { showHelpModal } = useSelector((state) => state.helpReducer);
  const { isOpenForumDrawer, isOpenForumAnswerDrawer, isOpenAskForumDrawer } =
    useSelector((state) => state.forumModalReducer);
  const { user } = useSelector((state) => state.authReducer.data);
  const { answers, selectedForum } = useSelector((state) => state.forumReducer);
  console.log({ answers });
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const [text, settext] = useState("");

  const dispatch = useDispatch();

  console.log({ isOpenChatbox });

  const closeDrawer = () => {
    dispatch(openChatBox(false));
  };

  const closeForumDrawer = () => {
    dispatch(openForumDrawer(false));
  };

  const closeForumAnswerDrawer = () => {
    dispatch(openForumAnswerDrawer(false));
  };
  const closeAskForumDrawer = () => {
    dispatch(openAskQuestionModal(false));
  };
  const closeAnnouncementModal = () => {
    dispatch(openAnnouncementModal(false));
  };

  const closeHelpModal = () => {
    dispatch(openHelpModal(false));
  };

  useEffect(() => {
    closeDrawer();
    dispatch(listAllNotifications(user?._id));
  }, []);

  const handleAnswer = async (e) => {
    console.log({ e });
    e.preventDefault();
    const payload = {
      userId: user?._id,
      forumId: selectedForum?._id,
      answer: text,
    };
    try {
      await postAnswer(payload);
      settext("");
      dispatch(getAnswerByQuestion(selectedForum?._id));
    } catch (error) {
      console.log({ error });
    }
  };

  const askQuestion = async () => {
    // e.preventDefault();
    const payload = {
      userId: user?._id,
      question: title,
      desc: description,
    };
    try {
      await publishQuestion(payload);
      setdescription("");
      settitle("");
      dispatch(openAskQuestionModal(false));
      dispatch(getAllQuestions());
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className="Home">
      {contextHolder}
      <ProfileCard location="homepage" />
      <PostContainer />
      <RightContainer />

      <Row>
        <Col span={12}>
          <Drawer
            contentWrapperStyle={{
              position: "fixed",
              width: "50%",
              marginLeft: "49%",
              height: "77vh",
              borderTopRightRadius: "20px",
              borderTopLeftRadius: "20px",
            }}
            bodyStyle={{
              padding: 0,
            }}
            style={{
              borderTopRightRadius: "20px",
              borderTopLeftRadius: "20px",
            }}
            // title="Messanger"
            placement="bottom"
            closable={false}
            onClose={closeDrawer}
            open={isOpenChatbox}
            getContainer={false}
            mask={true}
          >
            <ChatContainer />
          </Drawer>
        </Col>
      </Row>

      <Drawer
        title="Discussion Forum"
        width={850}
        closable={true}
        onClose={closeForumDrawer}
        open={isOpenForumDrawer}
      >
        <Forum />
        <Drawer
          title="Answers"
          width={400}
          closable={true}
          onClose={closeForumAnswerDrawer}
          open={isOpenForumAnswerDrawer}
          footer={
            <form onSubmit={handleAnswer}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextArea
                  onChange={(e) => settext(e.target.value)}
                  autoSize={{
                    minRows: 2,
                    maxRows: 6,
                  }}
                  name="answer"
                  placeholder="Write your answer here..."
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px 0 0 4px",
                    width: "90%",
                    marginBottom: "1rem",
                  }}
                  value={text}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#0077ff",
                    color: "#fff",
                    padding: "0.5rem",
                    border: "none",
                    borderRadius: "0 4px 4px 0",
                    width: "90%",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          }
        >
          <ForumAnswers />
        </Drawer>
      </Drawer>
      <Drawer
        title="Ask a Question"
        width={850}
        closable={true}
        onClose={closeAskForumDrawer}
        open={isOpenAskForumDrawer}
        extra={
          <Space>
            <button
              disabled={title === "" || description === "" ? true : false}
              onClick={askQuestion}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  title === "" || description === "" ? "grey" : "#4f44fb",
                padding: "8px 12px 8px 12px",
                border: "1px solid",
                borderColor:
                  title === "" || description === "" ? "grey" : "#4f44fb",
                borderRadius: 3,
                cursor: "pointer",
              }}
            >
              <div
                style={{ fontSize: "12px", color: "#fff", fontWeight: "bold" }}
              >
                Submit Question
              </div>
            </button>
          </Space>
        }
      >
        <AskQuestion
          onChangeDescription={(value) => {
            setdescription(value.html);
          }}
          onChangeTitle={(value) => {
            settitle(value.target.value);
          }}
          description={description}
          title={title}
        />
      </Drawer>
      <SendAnnoucementModal
        visible={showAnnouncementModal}
        onCancel={closeAnnouncementModal}
      />
      <HelpModal visible={showHelpModal} onCancel={closeHelpModal} />
    </div>
  );
};

export default Dashboard;
