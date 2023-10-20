import React from "react";
import { useState } from "react";
import { Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { publishQuestion } from "../../services/Forum";
import { getAllQuestions } from "../../redux/action/ForumAction";
import { openAskQuestionModal } from "../../redux/action/ForumModalAction";
import Editor from "./Editor";

export default function AskQuestion(props) {
  // const [question, setquestion] = useState("");
  // const [desc, setdesc] = useState("");
  const { user } = useSelector((state) => state.authReducer.data);
  const dispatch = useDispatch();

  const { onChangeTitle, onChangeDescription, title, description } = props;

  return (
    <div>
      <form>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "left", marginBottom: "0.5rem" }}>
            Title:
          </div>
          <Input
            onChange={onChangeTitle}
            name="question"
            placeholder="Write your title here..."
            style={{
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px 0 0 4px",
              width: "100%",
              marginBottom: "1rem",
            }}
            value={title}
          />
          <Editor value={description} onChange={onChangeDescription} />
        </div>
      </form>
    </div>
  );
}
