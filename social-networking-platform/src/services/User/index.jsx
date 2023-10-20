import axios from "axios";
import { API_URI } from "../../utils/constant";

const API = axios.create({ baseURL: API_URI });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

export const getUser = (userId) =>
  API.get(`/user/${userId}`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const updateUser = (id, formData) =>
  API.put(`/user/${id}`, formData, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const getAllUsers = (username) =>
  API.post(`/user`, username, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const getAllFollowRequest = ({ id }) =>
  API.get(`/user/getfollowrequests/${id}`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const getAllFollowerById = (id) =>
  API.get(`/user/getallfollowers/${id}`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const getAllFollowingById = (id) =>
  API.get(`/user/getallfollowing/${id}`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const follow = (id, data) =>
  API.put(`/user/${id}/follow`, data, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const unfollow = (id, data) =>
  API.put(`/user/${id}/unfollow`, data, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const forgotPassword = (data) =>
  API.post(`/user/resetpassword`, data, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const resetPassword = (data) =>
  API.post(`/user/reset-new-password`, data, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const acceptFollowRequest = (data) =>
  API.post(`/user/acceptfollowrequest`, data, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });

export const rejectFollowRequest = (data) =>
  API.post(`/user/rejectfollowrequest`, data, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const getAllSuggestedUsers = (userId) =>
  API.post(
    `/user/getallsuggestedusers`,
    { userId: userId },
    {
      headers: { "Access-Control-Allow-Origin": "*" },
    }
  );
export const deleteUser = (id, reason) =>
  API.delete(`/user/${id}/${reason}`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
