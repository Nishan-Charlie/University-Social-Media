import React, { useEffect } from "react";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Result, Typography, message, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "antd";
import { BsFillChatLeftFill } from "react-icons/bs";
import {
  openAskQuestionModal,
  openForumAnswerDrawer,
  openForumDrawer,
} from "../../redux/action/ForumModalAction";
import {
  getAllQuestions,
  getAnswerByQuestion,
  selectedForum,
} from "../../redux/action/ForumAction";
import { BUCKET_URI } from "../../utils/constant";
import { Images } from "../../assets/images";
import Popconfirm from "antd/lib/popconfirm";
import { deleteQuestion } from "../../services/Forum";

const { Paragraph, Text } = Typography;

export default function Forum() {
  const dispatch = useDispatch();
  const userAuth = useSelector((state) => state.authReducer.data);
  const data = useSelector((state) => state.forumReducer?.data);
  const loading = useSelector((state) => state.forumReducer?.loading);
  const [messageApi, contextHolder] = message.useMessage();

  const openAnswerDrawer = (question) => {
    dispatch(openForumAnswerDrawer(true));
    dispatch(getAnswerByQuestion(question?._id));
    dispatch(selectedForum(question));
  };
  const openAskQuestion = () => {
    dispatch(openAskQuestionModal(true));
  };
  const closeForumDrawer = () => {
    dispatch(openForumDrawer(false));
  };
  console.log({ data });
  useEffect(() => {
    dispatch(getAllQuestions());
  }, []);

  const AccessFailed = () => {
    return (
      <Result
        status="error"
        title="Forum Access Failed"
        subTitle="Please check and modify the following information before access forum."
        extra={[
          <Button onClick={closeForumDrawer} type="primary" key="console">
            Okay
          </Button>,
        ]}
      >
        <div className="desc">
          <Paragraph>
            <Text
              strong
              style={{
                fontSize: 16,
              }}
            >
              The content you submitted has the following error:
            </Text>
          </Paragraph>
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" /> Your
            account should have. <a>Department of study &gt;</a>
          </Paragraph>
        </div>
      </Result>
    );
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }

  const handleDeleteQuestion = async (id) => {
    messageApi.open({
      type: "loading",
      content: "Deleting..",
    });
    try {
      await deleteQuestion(id);
      dispatch(getAllQuestions());
      messageApi.destroy();
      messageApi.open({
        type: "success",
        content: "Question deleted!",
      });
    } catch (error) {
      console.log({ error });
      messageApi.destroy();
      messageApi.open({
        type: "error",
        content: "Error!",
      });
    }
  };

  return userAuth?.user?.course === "" ? (
    <AccessFailed />
  ) : loading ? (
    <Spin tip="Loading" />
  ) : (
    <>
      {contextHolder}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginBottom: "1rem",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Discussion Forum Based on Your Department of study
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            onClick={openAskQuestion}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#4f44fb",
              padding: "8px 12px 8px 12px",
              gap: 10,
              border: "#4f44fb 1px solid",
              borderRadius: 3,
              marginBottom: "1rem",
              width: "100%",
              cursor: "pointer",
            }}
          >
            <div
              style={{ fontSize: "12px", color: "#fff", fontWeight: "bold" }}
            >
              Ask Question
            </div>
          </div>
        </div>
      </div>
      <>
        {data?.data?.map((question) => {
          return (
            <Card
              size="small"
              // title="Small size card"
              // extra={<a href="#">More</a>}
              style={{
                width: "100%",
                marginBottom: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
              >
                <div>
                  <img
                    alt="profile"
                    style={{
                      height: "2rem",
                      width: "2rem",
                      borderRadius: "50%",
                    }}
                    src={
                      question?.userId?.profilePicture
                        ? BUCKET_URI + question?.userId?.profilePicture
                        : Images.DEFAULT_PROFILE
                    }
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    width: "88%",
                  }}
                >
                  <div
                    style={{
                      gap: "1rem",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        color: "gray",
                        fontWeight: "bold",
                      }}
                    >
                      Asked, {formatDate(question?.createdAt)}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          color: "gray",
                          fontWeight: "bold",
                        }}
                      >
                        by -
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#0c48aa",
                          fontWeight: "bold",
                          marginLeft: 5,
                        }}
                      >
                        {question?.userId?.firstname}
                      </div>
                    </div>
                  </div>
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "900",
                      }}
                    >
                      {question?.question}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "gray",
                        marginTop: "0.5rem",
                      }}
                      dangerouslySetInnerHTML={{ __html: question?.desc }}
                    ></div>
                  </div>
                  <div
                    style={{
                      height: "3rem",
                      width: "100%",
                      backgroundColor: "#F6F6F6",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingLeft: 10,
                      paddingRight: 10,
                      borderRadius: 24,
                      marginTop: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1.5rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#fff",
                          padding: "5px 15px 5px 15px",
                          gap: 10,
                          border: "grey 1px solid",
                          borderRadius: 25,
                          cursor: "pointer",
                        }}
                        onClick={() => openAnswerDrawer(question)}
                      >
                        <BsFillChatLeftFill color="gray" size={12} />
                        <div style={{ fontSize: "12px", color: "gray" }}>
                          {question?.answers?.length} answers
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#4f44fb",
                          padding: "5px 15px 5px 15px",
                          gap: 10,
                          border: "#4f44fb 1px solid",
                          borderRadius: 25,
                          cursor: "pointer",
                        }}
                        onClick={() => openAnswerDrawer(question)}
                      >
                        <EditOutlined style={{ color: "#fff" }} />
                        <div style={{ fontSize: "12px", color: "#fff" }}>
                          Write Answer
                        </div>
                      </div>
                    </div>

                    <Popconfirm
                      title="Delete the question"
                      description="Are you sure to delete this question?"
                      onConfirm={() => handleDeleteQuestion(question?._id)}
                      okText="Yes"
                      cancelText="No"
                      placement="topLeft"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 10,
                          border: "#FF2400 1px solid",
                          borderRadius: "50%",
                          cursor: "pointer",
                          padding: 5,
                        }}
                      >
                        <DeleteOutlined style={{ color: "#FF2400" }} />
                      </div>
                    </Popconfirm>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </>
    </>
  );
}
