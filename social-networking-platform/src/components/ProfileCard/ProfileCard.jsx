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
import {
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  List,
  Typography,
} from "antd";
import { getTimeline, openFilterModal } from "../../redux/action/ContentAction";
import axios from "axios";
import { HiLockClosed, HiOutlineLockClosed } from "react-icons/hi2";
import Toggle from "react-toggle";
import FollowerBox from "../FollowerBox/FollowerBox";
import { listAllFollowers } from "../../redux/action/FollowersAction";
import { listAllFollowing } from "../../redux/action/FollowingAction";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import { getAllAnnouncement } from "../../redux/action/AnnouncementAction";

const ProfileCard = ({ location }) => {
  const user = useSelector((state) => state.authReducer.data?.user);
  const followerData = useSelector((state) => state.followerReducer.content);
  const followingData = useSelector((state) => state.followingReducer.content);
  const { content } = useSelector((state) => state.announcementReducer);

  const [isVisible, setIsVisible] = useState(false);
  const [isFollowerShow, setIsFollowerShow] = useState(false);
  const [isFollowingShow, setIsFollowingShow] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [contentType, setContentType] = useState("all");

  const { password, ...other } = user;
  const [formData, setFormData] = useState(other);
  const [department, setDepartment] = useState(formData?.course);
  const [yearOfStudy, setYearOfStudy] = useState(formData?.yearOfStudy);
  const [contentCount, setContentCount] = useState(0);
  const [accountType, setAccountType] = useState(user?.accountType);
  const { Option } = Select;

  console.log({ user });

  const dispatch = useDispatch();

  useEffect(() => {
    getContentCount();
    dispatch(listAllFollowers(user?._id));
    dispatch(listAllFollowing(user?._id));
    dispatch(getAllAnnouncement());
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

  console.log({ content });

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
    setContentType(e.target.value);
    const payload = {
      id:
        e.target.value === "followers"
          ? user.following
          : e.target.value === "myPost"
          ? user._id
          : "",
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
      {!user?.isAdmin && (
        <div
          style={{
            padding: 10,
            borderRadius: 12,
            height: "6.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className={
            user?.studentType === "alumniStudent"
              ? "admin-panel-section-alumni"
              : "admin-panel-section-user"
          }
        ></div>
      )}
      {!user?.isAdmin ? (
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
              <Radio.Button value="all">All</Radio.Button>
              <Radio.Button value="myPost">Mine</Radio.Button>
              <Radio.Button value="followers">Followers</Radio.Button>
            </Radio.Group>
            <div className="FilterIcon" onClick={showDrawer}>
              <AiFillFilter />
            </div>
          </div>
          <span className="FilterDesc">
            In this filter allows what's type of content you want to see on your
            timeline.
          </span>
        </div>
      ) : (
        <div
          style={{
            padding: 10,
            borderRadius: 12,
            height: "6.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="admin-panel-section"
        ></div>
      )}

      {!user?.isAdmin ? (
        <div
          style={{ backgroundColor: user?.isAdmin ? "#fff" : "#fff" }}
          className="ProfileCard"
        >
          <div className="ProfileTopBox">
            <div onClick={() => setIsVisible(true)} className="EditProfileIcon">
              <AiOutlineSetting size={20} color="#fff" />
            </div>
            <div onClick={handleSignOut} className="SignOutProfileIcon">
              <AiOutlineLogout size={20} color="#fff" />
            </div>
          </div>
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
              <span className="username">@{formData.username}</span>
            </Link>
            {user?.studentType === "alumniStudent" ? (
              <>
                {formData?.designation && (
                  <span className="name">
                    {formData?.designation}{" "}
                    {formData?.company && `at ${formData?.company}`}{" "}
                  </span>
                )}
              </>
            ) : (
              <span className="name">
                {formData.firstname} {formData.lastname}
              </span>
            )}
          </div>

          <div className="followStatus">
            <div className="FollowColumn">
              <span className="followHeader">Posts</span>
              <span className="followValue">{contentCount}</span>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setIsFollowerShow(true)}
              className="FollowColumn"
            >
              <span className="followHeader">Followers</span>
              <span className="followValue">{followerData?.data?.length}</span>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setIsFollowingShow(true)}
              className="FollowColumn"
            >
              <span className="followHeader">Following</span>
              <span className="followValue">{followingData?.data?.length}</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{ backgroundColor: user?.isAdmin ? "#fff" : "#fff" }}
          className="ProfileCard"
        >
          <List
            header={
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Announcements
              </div>
            }
            bordered
            dataSource={content}
            renderItem={(item, index) => (
              <List.Item>
                <Typography.Text mark>[ {index + 1} ]</Typography.Text>{" "}
                {item?.announcement}
              </List.Item>
            )}
          />
        </div>
      )}
      <Modal
        style={{
          top: 25,
        }}
        width={750}
        title="Your Informations"
        open={isVisible}
        onCancel={handleClose}
        onOk={handleSubmit}
        okText="Update"
      >
        <Form
          layout="vertical"
          style={{ marginBottom: "2rem" }}
          className="infoForm"
        >
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
                {console.log({ accountType })}
                <div>
                  <Select
                    value={accountType}
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
            <Form.Item label="First name">
              <Input
                value={formData.firstname}
                onChange={handleChange}
                placeholder="First name"
                style={{ width: 225 }}
                className="CustomAntInput"
                name="firstname"
              />
            </Form.Item>

            <Form.Item label="Last name">
              <Input
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Last name"
                style={{ width: 225 }}
                className="CustomAntInput"
                name="lastname"
              />
            </Form.Item>

            <Form.Item label="Email">
              <Input
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                style={{ width: 225 }}
                className="CustomAntInput"
                name="email"
                disabled={true}
              />
            </Form.Item>
          </Space>

          <Space className="CenterSpace">
            <Form.Item label="Address">
              <Input
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                style={{ width: 225 }}
                className="CustomAntInput"
                name="address"
              />
            </Form.Item>

            <Form.Item label="Phone number">
              <Input
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone number"
                style={{ width: 225 }}
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
            </Form.Item>

            <Form.Item label="Emergency contact">
              <Input
                value={formData.emergencyContactNumber}
                onChange={handleChange}
                placeholder="Emergency contact"
                style={{ width: 225 }}
                className="CustomAntInput"
                name="emergencyContactNumber"
              />
            </Form.Item>
          </Space>

          <Space className="CenterSpace">
            <Form.Item label="Department">
              <Select
                style={{ width: 225 }}
                placeholder="Select Department"
                name="course"
                value={department}
                onSelect={(value) => setDepartment(value)}
              >
                {DEPARTMENT.map((department) => (
                  <Option key={department.name} value={department.name}>
                    {department.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Year of study">
              <Select
                style={{ width: 225 }}
                placeholder="Select Year of Study"
                name="yearOfStudy"
                value={yearOfStudy}
                onSelect={(value) => setYearOfStudy(value)}
              >
                {YEAR_OF_STUDY.map((year) => (
                  <Option key={year.year} value={year.year}>
                    {year.year}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {user?.studentType === "alumniStudent" && (
              <Form.Item label="Working company">
                <Input
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Working company"
                  style={{ width: 225 }}
                  className="CustomAntInput"
                  name="company"
                />
              </Form.Item>
            )}
          </Space>
          {user?.studentType === "alumniStudent" && (
            <Space className="CenterSpace">
              <Form.Item label="Designation">
                <Input
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Designation"
                  style={{ width: 275 }}
                  className="CustomAntInput"
                  name="designation"
                />
              </Form.Item>
              <Form.Item label="Year of experience">
                <Input
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Year of experience"
                  style={{ width: 275 }}
                  className="CustomAntInput"
                  name="experience"
                />
              </Form.Item>
            </Space>
          )}
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
        {!isEmpty(followerData?.data) &&
          followerData?.data?.map((person, idx) => {
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
        {!isEmpty(followingData?.data) &&
          followingData?.data?.map((person, idx) => {
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

export default ProfileCard;
