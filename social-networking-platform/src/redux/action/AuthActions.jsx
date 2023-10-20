import * as Api from "../../services/Auth";
import * as UserAPi from "../../services/User";
import * as ContentAPI from "../../services/Content";
import { toast } from "react-toastify";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

export const logIn = (formData, navigate) => async (dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const { data } = await Api.logIn(formData);
    dispatch({ type: "LOGIN_SUCCESS", data: data });
    if (data) NotificationManager.success("Login Successfully", "Success!");
  } catch (error) {
    dispatch({ type: "LOGIN_FAIL" });
    NotificationManager.error(error?.response?.data, "Warning");
  }
};

export const register = (formData, navigate) => async (dispatch) => {
  dispatch({ type: "REGISTER_START" });
  try {
    const { data } = await Api.signUp(formData);
    dispatch({ type: "REGISTER_SUCCESS", data: data });
    NotificationManager.success(
      "Verification mail sent. Please check your inbox",
      "Success!"
    );
  } catch (error) {
    dispatch({ type: "REGISTER_FAIL" });
    NotificationManager.error(error?.response?.data?.message, "Warning");
  }
};

export const updateUser = (id, formData) => async (dispatch) => {
  dispatch({ type: "UPDATING_START" });
  try {
    const { data } = await UserAPi.updateUser(id, formData);
    dispatch({ type: "UPDATING_SUCCESS", data: data });
  } catch (error) {
    dispatch({ type: "UPDATING_FAIL" });
  }
};

export const follow = (id, data) => async (dispatch) => {
  dispatch({ type: "FOLLOW", data: data });
  UserAPi.follow(id, data);
};

export const unfollow = (id, data) => async (dispatch) => {
  dispatch({ type: "UNFOLLOW", data: data });
  UserAPi.unfollow(id, data);
};
export const saveContent = (id, data) => async (dispatch) => {
  console.log("-------------");
  dispatch({ type: "SAVE_CONTENT", data: id });
  ContentAPI.saveContent(data);
};

export const archiveContent = (id, data) => async (dispatch) => {
  dispatch({ type: "ARCHIVE_CONTENT", data: id });
  ContentAPI.archiveContent(data);
};

export const logout = () => async (dispatch) => {
  dispatch({ type: "LOG_OUT" });
};
