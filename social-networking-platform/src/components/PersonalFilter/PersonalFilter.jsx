import React, { useEffect, useState } from "react";
import "./style.css";
import { Images } from "../../assets/images";
import { useDispatch, useSelector } from "react-redux";
import {
  API_URI,
  BUCKET_URI,
  DEPARTMENT,
  YEAR_OF_STUDY,
} from "../../utils/constant";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";
import { logout, updateUser } from "../../redux/action/AuthActions";
import { bucket } from "../../redux/action/BucketAction";
import {
  AiFillFilter,
  AiOutlineEdit,
  AiOutlineLogout,
  AiOutlineSetting,
} from "react-icons/ai";
import { Form, Input, Modal, Radio, Select, Space } from "antd";
import { getTimeline, openFilterModal } from "../../redux/action/ContentAction";
import axios from "axios";
import { HiLockClosed, HiOutlineLockClosed } from "react-icons/hi2";
import Toggle from "react-toggle";
import FollowerBox from "../FollowerBox/FollowerBox";
import { listAllFollowers } from "../../redux/action/FollowersAction";
import { listAllFollowing } from "../../redux/action/FollowingAction";
import { Link, useParams } from "react-router-dom";
import { getUser } from "../../services/User";

const PersonalFilter = ({ location }) => {
  const userAuth = useSelector((state) => state.authReducer.data?.user);
  const followerData = useSelector((state) => state.followerReducer.content);
  const followingData = useSelector((state) => state.followingReducer.content);
  const [isVisible, setIsVisible] = useState(false);
  const [isFollowerShow, setIsFollowerShow] = useState(false);
  const [isFollowingShow, setIsFollowingShow] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [contentType, setContentType] = useState("all");
  const [user, setuser] = useState({});

  // const { password, ...other } = user;
  const [formData, setFormData] = useState(user);
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [contentCount, setContentCount] = useState(0);
  const [accountType, setAccountType] = useState("public");

  const { Option } = Select;

  const dispatch = useDispatch();
  const { id } = useParams();

  const listUserbyUserId = async () => {
    try {
      const { data } = await getUser(id);
      console.log({ data });
      setFormData(data);
      setuser(data);
      const payload = {
        id: "",
        department: "",
        yearOfStudy: "",
        loggedInUser: data?._id,
      };
      dispatch(getTimeline(payload));
      console.log({ data });
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    listUserbyUserId();
    getContentCount();
    dispatch(listAllFollowers(user?._id));
    dispatch(listAllFollowing(user?._id));
  }, []);

  const getContentCount = () => {
    axios
      .get(`${API_URI}/content/getContentCount`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("profile")).token
          }`,
        },
      })
      .then((res) => {
        setContentCount(res.data);
      })
      .catch((err) => {});
  };

  const handleSignOut = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1 className="center-text">Are you sure?</h1>
            <p className="center-text">You want to sign out?</p>
            <div className="button-row">
              <button className="button infoButton custom-no" onClick={onClose}>
                No
              </button>
              <button
                className="button infoButton custom-yes"
                onClick={() => {
                  dispatch(logout());
                  onClose();
                }}
              >
                Yes
              </button>
            </div>
          </div>
        );
      },
    });
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setProfileImage(img);
      setProfileImageUrl(URL.createObjectURL(img));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let UserData = formData;
    if (profileImage) {
      const data = new FormData();
      const fileName = Date.now() + profileImage.name;
      data.append("name", fileName);
      data.append("file", profileImage);
      UserData.profilePicture = fileName;
      try {
        dispatch(bucket(data));
      } catch (err) {}
    }
    dispatch(
      updateUser(user._id, {
        ...UserData,
        course: department,
        yearOfStudy: yearOfStudy,
        accountType: accountType,
      })
    );
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setProfileImageUrl("");
      setProfileImage("");
    }, 600);
  };

  const handleSizeChange = (e) => {
    console.log({ e });
    setContentType(e.target.value);
    const payload = {
      id: "",
      archiveContents:
        e.target.value === "archived" ? user.archiveContents : "",
      savedContents: e.target.value === "saved" ? user.savedContents : "",
      department: "",
      yearOfStudy: "",
      loggedInUser: user?._id,
    };
    dispatch(getTimeline(payload));
  };

  const showDrawer = () => {
    dispatch(openFilterModal(true));
  };

  const handlePrivateChange = (value) => {
    setAccountType(value);
  };

  console.log(user?.followers);

  return (
    <div className="ProfileSide">
      {/* <NavigationBar /> */}
      {user?._id === id && (
        <div className="ContentTypeCard">
          <div
            style={{
              justifyContent: "space-evenly",
              display: "flex",
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Radio.Group
              buttonStyle="solid"
              value={contentType}
              onChange={handleSizeChange}
              className="ContentRadio"
            >
              <Radio.Button value="all">Yours</Radio.Button>
              <Radio.Button value="saved">Saved</Radio.Button>
              <Radio.Button value="archived">Archived</Radio.Button>
            </Radio.Group>
          </div>
          <span className="FilterDesc">
            In this filter allows what's type of content you want to see on your
            timeline.
          </span>
        </div>
      )}

      <div
        style={{ backgroundColor: userAuth?.isAdmin ? "#fff" : "#fff" }}
        className="ProfileCard"
      >
        {userAuth?.isAdmin && (
          <div className="ProfileTopBox">
            <div onClick={() => setIsVisible(true)} className="EditProfileIcon">
              <AiOutlineSetting size={20} color="#fff" />
            </div>
          </div>
        )}
        <div className="ProfileImages">
          <img
            src={
              user.profilePicture
                ? BUCKET_URI + user.profilePicture
                : Images.DEFAULT_PROFILE
            }
            alt="CoverImage"
            className="ImageTag"
          />
        </div>
        <div className="ProfileName">
          <Link
            to={`/profile/${user._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span className="username">@{user?.username}</span>
          </Link>
          {user?.studentType === "alumniStudent" ? (
            <>
              {user?.designation && (
                <span className="name">
                  {user?.designation} {user?.company && `at ${user?.company}`}{" "}
                </span>
              )}
            </>
          ) : (
            <span className="name">
              {user?.firstname} {user?.lastname}
            </span>
          )}
        </div>
      </div>

      <Modal
        style={{
          top: 25,
        }}
        width={610}
        title="Your Informations"
        open={isVisible}
        onCancel={handleClose}
        onOk={handleSubmit}
        okText="Update"
      >
        <Form className="infoForm">
          <div className="ProfileTopContainer">
            <label for="file-upload" class="custom-file-upload">
              <img
                alt="profile"
                src={
                  profileImageUrl
                    ? profileImageUrl
                    : formData.profilePicture
                    ? BUCKET_URI + formData.profilePicture
                    : Images.IMAGE_EDIT
                }
                style={{ height: "100%", width: "100%", borderRadius: "50%" }}
              />
            </label>
            <div
              style={{
                width: "40%",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div className="LockIconContainer">
                <div
                  style={{
                    borderColor:
                      accountType === "private" ? "#bf40bf" : "black",
                  }}
                  className="LockIconCircle"
                >
                  <HiOutlineLockClosed
                    color={accountType === "private" ? "#bf40bf" : "black"}
                    size={25}
                  />
                </div>
                <div>
                  <Select
                    defaultValue={accountType}
                    style={{
                      width: 120,
                    }}
                    onChange={handlePrivateChange}
                    options={[
                      {
                        value: "private",
                        label: "Private",
                      },
                      {
                        value: "public",
                        label: "Public",
                      },
                    ]}
                  />
                </div>
              </div>
              <span style={{ textAlign: "center", fontWeight: "bold" }}>
                This Account is{" "}
                {accountType === "private" ? "Private" : "Public"}
              </span>
            </div>
          </div>

          <input
            onChange={onImageChange}
            id="file-upload"
            type="file"
            name="profileImage"
            style={{ display: "none" }}
          />
          <Space className="CenterSpace">
            <Input
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First Name"
              style={{ width: 275 }}
              className="CustomAntInput"
              name="firstname"
            />
            <Input
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last Name"
              style={{ width: 275 }}
              className="CustomAntInput"
              name="lastname"
            />
          </Space>

          <Space className="CenterSpace">
            <Input
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              style={{ width: 275 }}
              className="CustomAntInput"
              name="email"
            />
            <Input
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              style={{ width: 275 }}
              className="CustomAntInput"
              name="address"
            />
          </Space>

          <Space className="CenterSpace">
            <Input
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              style={{ width: 275 }}
              className="CustomAntInput"
              name="phoneNumber"
              rules={[
                {
                  type: "number",
                  min: 10,
                  max: 10,
                },
              ]}
            />
            <Input
              value={formData.emergencyContactNumber}
              onChange={handleChange}
              placeholder="Emergency Contact"
              style={{ width: 275 }}
              className="CustomAntInput"
              name="emergencyContactNumber"
            />
          </Space>
          <Space className="CenterSpace">
            <Select
              style={{ width: 275 }}
              placeholder="Select Department"
              name="course"
              value={formData.course}
              onSelect={(value) => setDepartment(value)}
            >
              {DEPARTMENT.map((department) => (
                <Option key={department.name} value={department.name}>
                  {department.name}
                </Option>
              ))}
            </Select>

            <Select
              style={{ width: 275 }}
              placeholder="Select Year of Study"
              name="yearOfStudy"
              value={formData.yearOfStudy}
              onSelect={(value) => setYearOfStudy(value)}
            >
              {YEAR_OF_STUDY.map((year) => (
                <Option key={year.year} value={year.year}>
                  {year.year}
                </Option>
              ))}
            </Select>
          </Space>
        </Form>
      </Modal>

      <Modal
        style={{
          top: 25,
        }}
        width={500}
        title="Follower"
        open={isFollowerShow}
        onCancel={() => setIsFollowerShow(false)}
        footer={null}
      >
        {followerData?.data?.map((person, idx) => {
          if (person._id !== user?._id) {
            return <FollowerBox follower={person} idx={idx} />;
          }
        })}
      </Modal>

      <Modal
        style={{
          top: 25,
        }}
        width={500}
        title="Following"
        open={isFollowingShow}
        onCancel={() => setIsFollowingShow(false)}
        footer={null}
      >
        {followingData?.data?.map((person, idx) => {
          console.log(user);
          if (person._id !== user?._id) {
            console.log({ person });
            return <FollowerBox follower={person} idx={idx} />;
          }
        })}
      </Modal>
    </div>
  );
};

export default PersonalFilter;
