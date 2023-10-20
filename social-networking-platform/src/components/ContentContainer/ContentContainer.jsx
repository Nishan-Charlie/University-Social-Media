import React from "react";
import "./style.css";
import Contents from "../Contents/Contents";
import ContentShare from "../ContentShare/ContentShare";
import { useSelector } from "react-redux";

export default function ContentContainer() {
  const { user } = useSelector((state) => state.authReducer.data);

  return (
    <div className="PostSide">
      {!user?.isAdmin && <ContentShare />}
      <Contents />
    </div>
  );
}
