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

export const publishQuestion = (data) =>
  API.post("/forum", data, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const fetchAllQuestion = (data) =>
  API.post("/forum/getallquestion", data, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const postAnswer = (data) =>
  API.put("/forum/answer", data, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const getAllAnswersByForumId = (data) =>
  API.post(
    "/forum/getallanswersbyforumid",
    { forumId: data },
    {
      headers: { "Access-Control-Allow-Origin": "*" },
    }
  );
export const deleteQuestion = (id) =>
  API.delete(`/forum/${id}`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
