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

export const createAnnouncement = (data) =>
  API.post(`/announcement`, data, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });

export const getAnnouncements = (data) =>
  API.get(`/announcement`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
