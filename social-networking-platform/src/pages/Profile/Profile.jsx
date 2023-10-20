import React from "react";

import "./Profile.css";
import RightContainer from "../../components/RightContainer/RightContainer";
import PersonalFilter from "../../components/PersonalFilter/PersonalFilter";
import PersonalContentContainer from "../../components/PersonalContentContainer/PersonalContentContainer";
const Profile = () => {
  return (
    <div className="Profile">
      <PersonalFilter location="profilePage" />
      <PersonalContentContainer />
      <RightContainer />
    </div>
  );
};

export default Profile;
