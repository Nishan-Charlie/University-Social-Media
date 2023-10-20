import { Dropdown, message, Modal, Popconfirm } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useRef, useState } from "react";
import {
  AiFillCamera,
  AiFillLike,
  AiOutlineComment,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineLike,
  AiOutlineSend,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import { FiMoreHorizontal } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { updateBucket } from "../../redux/action/BucketAction";
import { getTimeline } from "../../redux/action/ContentAction";
import { likeOrDislike } from "../../services/Content";
import { API_URI, BUCKET_URI } from "../../utils/constant";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import _, { isEmpty } from "lodash";
import Collapsible from "react-collapsible";
import { BiArchiveIn } from "react-icons/bi";
import { BsFillBookmarkFill } from "react-icons/bs";
import { archiveContent, saveContent } from "../../redux/action/AuthActions";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShareAltOutlined } from "@ant-design/icons";
import { Checkbox, Row, Col, Input, Typography } from "antd";
import { io } from "socket.io-client";
import { useCallback } from "react";
import {
  CloseCircleOutlined,
  ExclamationCircleFilled,
  WarningOutlined,
} from "@ant-design/icons";

export default function Content({ content }) {
  const followerData = useSelector((state) => state.followerReducer.content);

  const socket = io("http://localhost:8080");

  const CheckboxGroup = Checkbox.Group;

  const [checkedFollowers, setCheckedFollowers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (e) => {
    const allUserIds =
      !isEmpty(followerData?.data) &&
      followerData?.data?.map((user) => user._id);
    setCheckedFollowers(e.target.checked ? allUserIds : []);
    setSelectAll(e.target.checked);
  };

  const handleCheckboxChange = (checkedValues) => {
    setCheckedFollowers(checkedValues);
  };

  const handleSendMsg = async (followersIds) => {
    console.log({ content });
    for (const followerId of followersIds) {
      socket.emit("send-msg", {
        to: followerId,
        from: user._id,
        newMessage: content.image ? content?.image : content?.desc,
        type: content.image ? "docs" : "text",
      });
      await axios.post(`${API_URI}/message/addmsg`, {
        from: user._id,
        to: followerId,
        message: content.image ? content?.image : content?.desc,
        type: content.image ? "docs" : "text",
      });
    }
  };

  const handleModalOk = () => {
    console.log("Checked followers:", checkedFollowers);
    handleSendMsg(checkedFollowers);
    setshowFollowerPop(false);
    setCheckedFollowers([]);
  };

  const handleReasonOk = () => {
    onConfirm();
    setreasonPop(false);
    setReason("");
  };

  const handleModalCancel = () => {
    setshowFollowerPop(false);
  };

  const handleReasonCancel = () => {
    setreasonPop(false);
  };

  const followerList =
    !isEmpty(followerData?.data) &&
    followerData?.data?.map((follower) => (
      <Col span={24}>
        <div
          style={{
            backgroundColor: "#F0F1F1",
            padding: 10,
            marginBottom: 10,
            borderRadius: 12,
          }}
        >
          <Checkbox key={follower?._id} value={follower?._id}>
            {follower?.firstname}
          </Checkbox>
        </div>
      </Col>
    ));

  const videoJsOptions = {
    autoplay: false,
    width: 660,
    height: 320,
    controls: true,
    muted: true,
  };

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const imageRef = useRef();
  const videoRef = useRef();
  const comment = useRef();
  const { confirm } = Modal;
  const { Paragraph, Text } = Typography;
  const { TextArea } = Input;

  const { user } = useSelector((state) => state.authReducer.data);
  const publishloading = useSelector((state) => state.contentReducer.loading);

  const [liked, setLiked] = useState(content.likes.includes(user._id));
  const [likes, setLikes] = useState(content.likes.length);
  const [isVisible, setIsVisible] = useState(false);
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [contentImage, setContentImage] = useState(BUCKET_URI + content?.image);
  const [description, setDescription] = useState(content?.desc);
  const [contentVideo, setContentVideo] = useState(BUCKET_URI + content?.video);
  const [commentCount, setCommentCount] = useState(content?.comments?.length);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comments, setComments] = useState(content?.comments);
  const [isSaved, setIsSaved] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [showFollowerPop, setshowFollowerPop] = useState(false);
  const [reasonPop, setreasonPop] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    setIsSaved(user?.savedContents?.includes(content._id));
    setIsArchived(user?.archiveContents?.includes(content._id));
  }, [user]);

  const onConfirm = () => {
    const role = user?.isAdmin ? "admin" : "user";
    messageApi.open({
      type: "loading",
      content: "Deleting in progress...",
    });
    axios
      .delete(
        `${API_URI}/content/${content._id}/${role}/${reason ? reason : ""}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("profile")).token
            }`,
          },
        }
      )
      .then((res) => {
        const payload = {
          id: "",
          department: "",
          yearOfStudy: "",
          loggedInUser: user?._id,
        };
        dispatch(getTimeline(payload));
        messageApi.destroy();
        messageApi.open({
          type: "success",
          content: "Content deleted.",
        });
        setIsSaved((prev) => prev);
      })
      .catch((err) => {
        messageApi.destroy();
      });
  };

  const handleChange = useCallback(
    (e) => {
      setReason(e.target.value);
    },
    [setReason]
  );

  const showDeleteConfirm = useCallback(() => {
    confirm({
      title: "Are you sure delete this user?",
      icon: <ExclamationCircleFilled />,
      content: (
        <div style={{ marginTop: "1rem" }}>
          <Paragraph>
            <WarningOutlined style={{ color: "red" }} /> When a user is deleted,
            <span style={{ color: "red" }}>
              all their associated content will be delete!
            </span>
          </Paragraph>
          <div style={{ fontSize: "15px", marginBottom: "5px" }}>Reason</div>
          <TextArea
            value={reason}
            onChange={handleChange}
            placeholder="Enter the reason"
            autoSize={{
              minRows: 3,
              maxRows: 5,
            }}
          />
        </div>
      ),
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      closable: true,
      okButtonProps: {
        disabled: reason.trim() === "",
      },
      onOk() {
        onConfirm();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }, []);

  const saveContentFunction = async () => {
    const payload = {
      userId: user?._id,
      postId: content?._id,
    };
    try {
      await messageApi.open({
        type: "loading",
        content: "Saving...",
      });
      console.log("dadaadada");
      await dispatch(saveContent(content?._id, payload));
      await messageApi.destroy();
      await messageApi.open({
        type: "success",
        content: "Content saved!",
      });
      // setIsSaved((prev) => !prev);
    } catch (error) {
      await messageApi.destroy();
      console.log({ error });
    }
  };

  const archiveContentFunction = async () => {
    const payload = {
      userId: user?._id,
      postId: content?._id,
    };
    const timeline = {
      id: "",
      department: "",
      yearOfStudy: "",
      loggedInUser: user?._id,
    };
    try {
      await messageApi.open({
        type: "loading",
        content: "Saving...",
      });
      await dispatch(archiveContent(content?._id, payload));
      await dispatch(getTimeline(timeline));
      await messageApi.destroy();
      await messageApi.open({
        type: "success",
        content: "Content archived!",
      });
      // setIsArchived((prev) => !prev);
    } catch (error) {
      await messageApi.destroy();
      console.log({ error });
    }
  };

  const handleShareClick = () => {
    setshowFollowerPop(true);
  };

  const items = [
    content?.userId === user?._id && {
      label: "Edit",
      key: "1",
      icon: <AiOutlineEdit />,
    },
    !user?.isAdmin && {
      label: (
        <Popconfirm
          disabled={isSaved}
          title="Save the content"
          description="Are you sure to save this content?"
          onConfirm={saveContentFunction}
          okText="Yes"
          cancelText="No"
        >
          {isSaved ? "Saved" : "Save"}
        </Popconfirm>
      ),
      key: "3",
      icon: <BsFillBookmarkFill />,
      disabled: isSaved,
    },

    !user?.isAdmin &&
      content?.userId === user?._id && {
        label: (
          <Popconfirm
            disabled={isArchived}
            title="Archive the content"
            description="Are you sure to archive this content?"
            onConfirm={archiveContentFunction}
            okText="Yes"
            cancelText="No"
          >
            {isArchived ? "Archived" : "Archive"}
          </Popconfirm>
        ),
        key: "2",
        icon: <BiArchiveIn />,
        disabled: isArchived,
      },

    content?.userId === user?._id && {
      label: (
        <Popconfirm
          title="Delete the content"
          description="Are you sure to delete this content?"
          onConfirm={onConfirm}
          okText="Yes"
          cancelText="No"
        >
          Remove
        </Popconfirm>
      ),
      key: "4",
      icon: <AiOutlineDelete />,
    },

    user?.isAdmin && {
      label: "Remove",
      key: "6",
      icon: <AiOutlineDelete />,
    },
    !user?.isAdmin && {
      // content?.userId === user?._id &&
      label: "Share",
      key: "5",
      icon: <ShareAltOutlined />,
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key === "1") setIsVisible(true);
    if (e.key === "5") handleShareClick();
    if (e.key === "6") setreasonPop(true);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const handleClose = () => {
    setIsVisible(false);
    setContentImage(BUCKET_URI + content?.image);
    setContentVideo(BUCKET_URI + content?.video);
  };

  const handleCommentClose = () => {
    setIsCommentVisible(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const warning = () => {
      messageApi.open({
        type: "warning",
        content: "Write something!",
      });
    };

    if (description === "" && image === null && video === null) {
      warning();
    } else {
      messageApi.open({
        type: "loading",
        content: "Uploading in progress...",
      });
      const newPost = {
        desc: description,
      };

      if (image) {
        const data = new FormData();
        const fileName = Date.now() + image.name;
        data.append("name", fileName);
        data.append("file", image);
        newPost.image = fileName;
        newPost.video = "";
        try {
          const contentName =
            content?.image === "" ? content?.video : content?.image;
          dispatch(updateBucket(contentName, data));
        } catch (err) {}
      }

      if (video) {
        const data = new FormData();
        const fileName = Date.now() + video.name;
        data.append("name", fileName);
        data.append("file", video);
        newPost.video = fileName;
        newPost.image = "";
        try {
          const contentName =
            content?.image === "" ? content?.video : content?.image;
          dispatch(updateBucket(contentName, data));
        } catch (err) {}
      }
      axios
        .put(`${API_URI}/content/updateContent/${content._id}`, newPost, {
          headers: { "Access-Control-Allow-Origin": "*" },
        })
        .then((res) => {
          const payload = {
            id: "",
            department: "",
            yearOfStudy: "",
            loggedInUser: user?._id,
          };
          dispatch(getTimeline(payload));
          messageApi.destroy();
          messageApi.open({
            type: "success",
            content: "Uploading finished.",
          });
        })
        .catch((err) => {
          messageApi.destroy();
        });

      reset();
    }
  };

  const handleLike = () => {
    likeOrDislike(content._id, user._id);
    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };

  const handleComment = () => {
    const payload = {
      userId: user?._id,
      postId: content?._id,
      comment: comment.current.value,
    };
    axios
      .put(`${API_URI}/content/comment`, payload, {
        headers: { "Access-Control-Allow-Origin": "*" },
      })
      .then((res) => {
        console.log({ res });
        setCommentCount((prev) => prev + 1);

        console.log({ comments });
        const imeComment = [
          {
            comment: comment.current.value,
            user: {
              profilePicture: user?.profilePicture,
              username: user?.username,
            },
          },
        ];
        comment.current.value = "";
        setComments([...comments, ...imeComment]);
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: "There was an issue while comment.",
        });
      });
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let content = event.target.files[0];
      if (event.target.name === "video") {
        setVideo(content);
        setContentVideo(URL.createObjectURL(content));
        setContentImage(null);
      } else {
        setImage(content);
        setContentImage(URL.createObjectURL(content));
        setContentVideo(null);
      }
    }
  };

  const reset = () => {
    setImage(null);
    setVideo(null);
  };

  const isDisableUpdate = () => {
    if (
      description === content?.desc &&
      contentImage === BUCKET_URI + content?.image &&
      contentVideo === BUCKET_URI + content?.video
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleCommentExpand = () => {
    setIsCommentOpen(!isCommentOpen);
  };

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  return (
    <div className="Post">
      {contextHolder}
      <div className="post-user-container">
        <div className="post-user-left">
          <img
            className="post-user-profile"
            src={
              content?.users?.profilePicture
                ? BUCKET_URI + content.users?.profilePicture
                : Images.DEFAULT_PROFILE
            }
            alt="profile"
          />
          <div className="post-user-details">
            <Link
              target="_blank"
              to={`/profile/${content?.users?._id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              <span className="post-username">
                {content?.users?.username}{" "}
                {content?.users?.studentType === "alumniStudent" && (
                  <span>🎓</span>
                )}
              </span>
            </Link>
            <span className="post-time">
              {moment(content.createdAt).fromNow()}
            </span>
          </div>
        </div>
        {
          <div>
            <Dropdown
              menu={menuProps}
              trigger={["click"]}
              placement="bottomRight"
              arrow
            >
              <FiMoreHorizontal className="MoreOption" />
            </Dropdown>
          </div>
        }
      </div>
      {content.desc && (
        <span className="post-desc">
          {isValidUrl(content.desc) ? (
            <a href={content.desc} target="_blank" rel="noopener noreferrer">
              {content.desc}
            </a>
          ) : (
            content.desc
          )}
        </span>
      )}

      {content.image && (
        <img src={BUCKET_URI + content.image} alt="Timeline Content" />
      )}
      {content.video && (
        <VideoPlayer
          {...videoJsOptions}
          sources={[
            {
              src: BUCKET_URI + content.video,
              type: "video/mp4",
            },
          ]}
        />
      )}

      <Collapsible
        trigger={
          <div className="like-row">
            <div className="LikeRow">
              <div onClick={handleLike} className="postReact">
                {liked ? (
                  <AiFillLike
                    style={{ cursor: "pointer" }}
                    size={24}
                    color="#246ee9"
                  />
                ) : (
                  <AiOutlineLike style={{ cursor: "pointer" }} size={24} />
                )}
              </div>
              <span className="like-text">{likes} likes</span>
            </div>
            <div className="CommentRow" onClick={handleCommentExpand}>
              <div className="postReact">
                <AiOutlineComment style={{ cursor: "pointer" }} size={24} />
              </div>
              <span className="like-text">{commentCount} Comments</span>
            </div>
          </div>
        }
        open={isCommentOpen}
      >
        <div className="CommentsContainer">
          {_.isEmpty(comments) ? (
            <span>No Comments</span>
          ) : (
            comments?.map((com, index) => (
              <div key={index} className="CommentView">
                <img
                  src={
                    com.user?.profilePicture
                      ? BUCKET_URI + com.user?.profilePicture
                      : Images.DEFAULT_PROFILE
                  }
                  alt="profile"
                  className="commentProfile"
                />
                <div className="CommentBackground">
                  <span className="CommenterName">{com.user?.username}</span>
                  <span className="CommenterValue">{com?.comment}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Collapsible>

      <div className="CommentSection">
        <img
          src={
            user?.profilePicture
              ? BUCKET_URI + user?.profilePicture
              : Images.DEFAULT_PROFILE
          }
          alt="Profile"
          className="commentProfile"
        />
        <input
          ref={comment}
          type="text"
          placeholder="Write your comment..."
          required
          className="CommentInput"
        />
        <div onClick={handleComment} className="SendComment">
          <AiOutlineSend color="#fff" />
        </div>
      </div>

      <Modal
        style={{
          top: 25,
        }}
        width={700}
        title="Update your timeline content"
        open={isVisible}
        onCancel={handleClose}
        okText="Update"
        footer={null}
      >
        <div className="PostShare">
          {contextHolder}
          <img
            src={
              user.profilePicture
                ? BUCKET_URI + user.profilePicture
                : Images.DEFAULT_PROFILE
            }
            alt="Profile"
          />
          <div>
            <input
              value={description}
              type="text"
              placeholder={`What's on your mind, ${user?.username} ?`}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="postOptions">
              <div
                onClick={() => imageRef.current.click()}
                className="option"
                style={{ color: "var(--photo)" }}
              >
                <AiFillCamera style={{ marginRight: "3px" }} size={25} />
                <span className="option-title"> Photo</span>
              </div>

              <div
                onClick={() => videoRef.current.click()}
                className="option"
                style={{ color: "var(--shedule)" }}
              >
                <AiOutlineVideoCameraAdd
                  style={{ marginRight: "3px" }}
                  size={25}
                />
                <span className="option-title"> Video</span>
              </div>
              <button
                disabled={isDisableUpdate()}
                onClick={handleUpload}
                className="button ps-button"
              >
                {publishloading ? "uploading" : "Update"}
              </button>

              <div style={{ display: "none" }}>
                <input
                  type="file"
                  ref={imageRef}
                  onChange={onImageChange}
                  name="image"
                  accept="image/png, image/gif, image/jpeg"
                />
              </div>
              <div style={{ display: "none" }}>
                <input
                  type="file"
                  ref={videoRef}
                  name="video"
                  onChange={onImageChange}
                  accept="video/mp4,video/x-m4v,video/*"
                />
              </div>
            </div>
          </div>
        </div>

        {contentImage && (
          <img
            src={contentImage}
            alt="TimelinePicture"
            className="EditTimelineImage"
          />
        )}
        {contentVideo && (
          <video
            src={contentVideo}
            alt="TimelinePicture"
            className="EditTimelineImage"
          />
        )}
      </Modal>

      <Modal
        style={{
          top: 25,
        }}
        width={700}
        title="Comments"
        open={isCommentVisible}
        onCancel={handleCommentClose}
        footer={null}
      >
        {_.isEmpty(content?.comments) ? (
          <span>No Comments</span>
        ) : (
          content?.comments?.map((com, index) => (
            <div key={index} className="CommentView">
              <img
                src={
                  com.user?.profilePicture
                    ? BUCKET_URI + com.user?.profilePicture
                    : Images.DEFAULT_PROFILE
                }
                alt="profile"
                className="commentProfile"
              />
              <div className="CommentBackground">
                <span className="CommenterName">@{com.user?.username}</span>
                <span className="CommenterValue">{com?.comment}</span>
              </div>
            </div>
          ))
        )}
      </Modal>

      <Modal
        title="Share post with followers"
        open={showFollowerPop}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <div style={{ marginBottom: "1rem", fontWeight: "bolder" }}>
          Followers List
        </div>

        <Checkbox
          checked={selectAll}
          onChange={handleSelectAll}
          style={{ marginBottom: "1rem", marginLeft: "0.6rem" }}
        >
          All users
        </Checkbox>
        <br />
        <CheckboxGroup onChange={handleCheckboxChange} value={checkedFollowers}>
          <Row>{followerList}</Row>
        </CheckboxGroup>
      </Modal>

      <Modal
        title="Remove content"
        open={reasonPop}
        onOk={handleReasonOk}
        onCancel={handleReasonCancel}
      >
        <div style={{ marginTop: "1rem" }}>
          {/* <Paragraph>
            <WarningOutlined style={{ color: "red" }} /> When a user is deleted,
            <span style={{ color: "red" }}>
              all their associated content will be delete!
            </span>
          </Paragraph> */}
          <div style={{ fontSize: "15px", marginBottom: "5px" }}>Reason</div>
          <TextArea
            value={reason}
            onChange={handleChange}
            placeholder="Enter the reason"
            autoSize={{
              minRows: 3,
              maxRows: 5,
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
