import axios from "axios";
import { API_URI, METHOD } from "../../utils/constant";
import Api from "../../utils/axios";

const API = axios.create({ baseURL: API_URI });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }

  return req;
});

export const publishContent = (data) =>
  API.post("/content", data, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const getTimelineContent = (body) =>
  API.post(`/content/timeline`, body, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const likeOrDislike = (id, userId) =>
  API.put(
    `content/${id}/like`,
    { userId: userId },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
export const saveContent = (body) =>
  API.post(`/content/savecontent`, body, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });

export const archiveContent = (body) =>
  API.post(`/content/archivecontent`, body, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
