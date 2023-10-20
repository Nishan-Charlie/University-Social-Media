import React from "react";
import { Link } from "react-router-dom";
import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import { IoNotifications } from "react-icons/io5";
import { BsFillChatFill } from "react-icons/bs";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { openChatBox } from "../../redux/action/MessageAction";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useState } from "react";
import { Avatar, Badge, List, Popover, Modal } from "antd";
import { BUCKET_URI } from "../../utils/constant";
import { Images } from "../../assets/images";
import moment from "moment";
import { listAllNotifications } from "../../redux/action/NotificationAction";
import { MdForum } from "react-icons/md";
import { openForumDrawer } from "../../redux/action/ForumModalAction";
import { Tooltip } from "antd";
import { TfiAnnouncement } from "react-icons/tfi";
import { openAnnouncementModal } from "../../redux/action/AnnouncementAction";
import { logout } from "../../redux/action/AuthActions";
import { confirmAlert } from "react-confirm-alert";
import { HiSpeakerphone } from "react-icons/hi";
import { IoIosHelpCircle } from "react-icons/io";
import { openHelpModal } from "../../redux/action/HelpAction";

export default function NavigationBar() {
  const { isOpenChatbox } = useSelector((state) => state.messageReducer);
  const { isOpenForumDrawer } = useSelector((state) => state.forumModalReducer);
  const userAuth = useSelector((state) => state.authReducer.data);
  const notify = useSelector((state) => state.notificationReducer);
  const [visible, setVisible] = useState(false);
  const [notifications, setnotifications] = useState([]);

  console.log({ notify });

  const socket = io("http://localhost:8080", {
    query: { userId: userAuth?.user?._id },
  });

  const dispatch = useDispatch();
  const showDrawer = () => {
    dispatch(openChatBox(!isOpenChatbox));
  };
  const openAnnouncement = () => {
    dispatch(openAnnouncementModal(true));
  };

  const showForumDrawer = () => {
    dispatch(openForumDrawer(!isOpenForumDrawer));
  };

  const openHelpModalFun = () => {
    dispatch(openHelpModal(true));
  };

  useEffect(() => {
    socket.on("notification", (data) => {
      setnotifications([...notifications, data]);
      console.log(data.message); // Output: 'Hello, world!'
    });
  }, []);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  useEffect(() => {
    dispatch(listAllNotifications(userAuth?.user?._id));
    setnotifications(notify?.content?.data);
  }, []);

  const content = (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ textAlign: "center", fontWeight: "bold" }}>
          Notifications
        </span>
      </div>
      <List
        dataSource={notifications}
        itemLayout="horizontal"
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              className="custom-antd-list"
              avatar={
                <Avatar
                  src={
                    item.profile
                      ? BUCKET_URI + item.profile
                      : Images.DEFAULT_PROFILE
                  }
                />
              }
              title={item?.title}
              description={moment(item?.time).fromNow()}
            />
          </List.Item>
        )}
      />
    </>
  );

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

  return (
    <div className="navIcons">
      <Link to="../home">
        <Tooltip title="Home">
          <AiFillHome className="nav-icon" size={25} />
        </Tooltip>
      </Link>
      {!userAuth?.user?.isAdmin && (
        <Tooltip title="Forum">
          <MdForum
            style={{ cursor: "pointer" }}
            onClick={showForumDrawer}
            className="nav-icon"
            size={25}
          />
        </Tooltip>
      )}
      {!userAuth?.user?.isAdmin && (
        <Link>
          <Popover
            overlayClassName="bg-2"
            placement="bottomRight"
            trigger={["click"]}
            content={content}
            visible={visible}
            onVisibleChange={handleVisibleChange}
            overlayStyle={{
              width: 336,
            }}
          >
            <Badge count={notifications?.length}>
              <Tooltip title="Notifications">
                <IoNotifications
                  onClick={() => setVisible(!visible)}
                  className="nav-icon"
                  size={25}
                />
              </Tooltip>
            </Badge>
          </Popover>
        </Link>
      )}

      {!userAuth?.user?.isAdmin ? (
        <Link onClick={showDrawer}>
          <Tooltip title="Chat">
            <BsFillChatFill className="nav-icon" size={24} />
          </Tooltip>
        </Link>
      ) : (
        <Link onClick={openAnnouncement}>
          <Tooltip title="Announcement">
            <HiSpeakerphone className="nav-icon" size={24} />
          </Tooltip>
        </Link>
      )}
      {userAuth?.user?.isAdmin && (
        <Link onClick={handleSignOut}>
          <Tooltip title="Signout">
            <AiOutlineLogout className="nav-icon" size={24} color="red" />
          </Tooltip>
        </Link>
      )}
      {!userAuth?.user?.isAdmin && (
        <Link onClick={openHelpModalFun}>
          <Tooltip title="Help">
            <IoIosHelpCircle className="nav-icon" size={24} />
          </Tooltip>
        </Link>
      )}
    </div>
  );
}
