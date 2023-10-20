import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  AiFillCamera,
  AiOutlineClose,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { API_URI, BUCKET_URI } from "../../utils/constant";
import { message } from "antd";
import { getTimeline } from "../../redux/action/ContentAction";
import { bucket } from "../../redux/action/BucketAction";
import PersonalProfile from "../PersonalProfile/PersonalProfile";
import { useParams } from "react-router-dom";

export default function PersonalContentShare() {
  const user = useSelector((state) => state.authReducer.data).user;
  const publishloading = useSelector((state) => state.contentReducer.loading);
  const { id } = useParams();

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const imageRef = useRef();
  const videoRef = useRef();
  const description = useRef();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const payload = {
      id: "",
      department: "",
      yearOfStudy: "",
      loggedInUser: user?._id,
    };
    dispatch(getTimeline(payload));
  }, []);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let content = event.target.files[0];
      event.target.name === "video" ? setVideo(content) : setImage(content);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const warning = () => {
      messageApi.open({
        type: "warning",
        content: "Write something!",
      });
    };

    if (description.current.value === "" && image === null && video === null) {
      warning();
    } else {
      messageApi.open({
        type: "loading",
        content: "Uploading in progress...",
      });
      const newPost = {
        userId: user._id,
        desc: description.current.value,
        users: user._id,
      };

      if (image) {
        const data = new FormData();
        const fileName = Date.now() + image.name;
        data.append("name", fileName);
        data.append("file", image);
        newPost.image = fileName;
        try {
          dispatch(bucket(data));
        } catch (err) {}
      }

      if (video) {
        const data = new FormData();
        const fileName = Date.now() + video.name;
        data.append("name", fileName);
        data.append("file", video);
        newPost.video = fileName;
        try {
          dispatch(bucket(data));
        } catch (err) {}
      }
      axios
        .post(`${API_URI}/content`, newPost, {
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

  const reset = () => {
    setImage(null);
    setVideo(null);
    description.current.value = "";
  };

  return (
    <div>
      <PersonalProfile />
      {id === user?.id && (
        <div style={{ marginTop: "1rem" }} className="PostShare">
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
              ref={description}
              type="text"
              placeholder={`What's on your mind, ${user?.username} ?`}
              required
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
                disabled={publishloading}
                onClick={handleUpload}
                className="button ps-button"
              >
                {publishloading ? "uploading" : "Publish"}
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
            {image && (
              <div className="previewImage">
                <AiOutlineClose
                  className="CancelPreview"
                  onClick={() => setImage(null)}
                />
                <img src={URL.createObjectURL(image)} alt="preview" />
              </div>
            )}
            {video && (
              <>
                <AiOutlineClose
                  className="CancelPreview"
                  onClick={() => setVideo(null)}
                />
                <div className="previewImage">
                  <video src={URL.createObjectURL(video)} alt="preview" />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
