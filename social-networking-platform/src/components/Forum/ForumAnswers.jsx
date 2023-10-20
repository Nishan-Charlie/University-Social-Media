import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BUCKET_URI } from "../../utils/constant";
import { Images } from "../../assets/images";

export default function ForumAnswers() {
  const { answers, selectedForum } = useSelector((state) => state.forumReducer);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ fontWeight: "bold", marginBottom: "1rem" }}>
        Question : {selectedForum?.question}
      </div>
      {/* Display user answers */}
      {answers &&
        answers?.data?.map((answer, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <img
              src={
                answer?.user?.profilePicture
                  ? BUCKET_URI + answer?.user?.profilePicture
                  : Images.DEFAULT_PROFILE
              }
              alt="User avatar"
              style={{
                width: "35px",
                borderRadius: "50%",
                marginRight: "1rem",
              }}
            />
            <div>
              <div style={{ fontSize: "10px", color: "gray" }}>
                Answered by : {answer?.user?.firstname}{" "}
              </div>
              <div style={{ fontSize: "13px", color: "black" }}>
                {answer?.answer}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
