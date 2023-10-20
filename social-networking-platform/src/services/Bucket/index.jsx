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

export const uploadImage = (data) =>
  API.post("/bucket/", data, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const updateImage = (filename, data) =>
  API.put(`/bucket/${filename}`, data, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
