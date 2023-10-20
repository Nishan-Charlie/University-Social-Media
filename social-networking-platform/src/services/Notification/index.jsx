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

export const getAllNotifications = (id) =>
  API.get(`/notification/${id}`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
