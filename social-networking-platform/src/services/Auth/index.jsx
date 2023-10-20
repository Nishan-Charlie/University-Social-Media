import axios from "axios";
import { API_URI } from "../../utils/constant";

const API = axios.create({ baseURL: API_URI });

export const logIn = (formData) =>
  API.post("/auth/login", formData, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const signUp = (formData) =>
  API.post("/auth/register", formData, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
