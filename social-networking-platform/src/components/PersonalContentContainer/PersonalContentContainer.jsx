import React from "react";
import "./style.css";
import Contents from "../Contents/Contents";
import ContentShare from "../ContentShare/ContentShare";
import PersonalContentShare from "../PersonalContentShare/PersonalContentShare";
import PersonalContents from "../PersonalContents/PersonalContents";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PersonalContentContainer() {
  return (
    <div className="PostSide">
      <PersonalContentShare />
      <PersonalContents />
    </div>
  );
}
