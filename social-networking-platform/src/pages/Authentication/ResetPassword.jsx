import React, { useState } from "react";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Images } from "../../assets/images";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPassword } from "../../services/User";
import { message } from "antd";

const ResetPassword = () => {
  const { userId, uniqString } = useParams();
  console.log(userId, uniqString);
  const initialState = {
    email: "",
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmpass: "",
  };
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [data, setData] = useState(initialState);
  const [confirmPass, setConfirmPass] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isValidEmail] = useState(true);

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const resetNewPassword = async (e) => {
    const payload = {
      userId: userId,
      uniqString: uniqString,
      newPassword: e.target[0].value,
    };
    try {
      messageApi.open({
        type: "loading",
        content: "Action in progress..",
        duration: 0,
      });
      await resetPassword(payload);
      messageApi.destroy();
      messageApi.open({
        type: "success",
        content: "Password reset successfully!",
      });
      navigate("/auth");
    } catch (error) {
      console.log({ error });
      messageApi.destroy();
      messageApi.open({
        type: "error",
        content: error.response.data.message,
      });
    }
  };

  const handleSubmit = (e) => {
    setConfirmPass(true);
    e.preventDefault();
    if (data.password === data.confirmpass && isPasswordValid && isValidEmail)
      resetNewPassword(e);
    else if (
      data.password === data.confirmpass &&
      !isPasswordValid &&
      isValidEmail
    ) {
      setIsPasswordValid(false);
    } else if (
      data.password !== data.confirmpass &&
      isPasswordValid &&
      isValidEmail
    ) {
      setConfirmPass(false);
    }
  };

  return (
    <div className="Auth">
      {contextHolder}
      <NotificationContainer />
      <ToastContainer />
      <div className="a-right">
        <form onSubmit={handleSubmit} className="infoForm authForm">
          <h3>Reset Password</h3>
          <div>
            <input
              required
              type="password"
              className={!isPasswordValid ? "infoInput not-valid" : "infoInput"}
              placeholder="New Password"
              name="password"
              value={data.password}
              onChange={(e) => {
                handleChange(e);
                setIsPasswordValid(passwordRegex.test(e.target.value));
              }}
            />
          </div>

          <div>
            <input
              required
              type="password"
              className="infoInput"
              name="confirmpass"
              placeholder="Confirm Password"
              onChange={(e) => {
                handleChange(e);
                data.password === e.target.value
                  ? setConfirmPass(true)
                  : setConfirmPass(false);
              }}
            />
          </div>

          {!isPasswordValid && (
            <div>
              <span className="valid-password-text">
                Password must contain at least 8 characters, including <br />{" "}
                upper/lowercase and numbers
              </span>
            </div>
          )}

          <span
            className="valid-password-text"
            style={{
              display: confirmPass ? "none" : "block",
            }}
          >
            Confirm password is not same
          </span>
          <div>
            <button className="button infoButton" type="Submit">
              Update
            </button>
          </div>
        </form>
      </div>

      <div className="a-left">
        <img src={Images.LOGIN_LOGO} alt="" />

        {/* <div className="Webname">
          <h1>Social Media Platform</h1>
          <h6>Explore the ideas throughout the world</h6>
        </div> */}
      </div>
    </div>
  );
};

export default ResetPassword;
