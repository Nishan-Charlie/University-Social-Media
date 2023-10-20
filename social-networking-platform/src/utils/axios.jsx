import axios from "axios";
import { API_URI } from "./constant";

export function isJSONString(string) {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
}

export function addParamsToURL(url, params) {
  if (
    params &&
    Object.entries(params).length !== 0 &&
    params.constructor === Object
  ) {
    let temp = url;
    let count = 0;
    for (let [key, value] of Object.entries(params)) {
      temp += `${count === 0 ? "?" : "&"}${key}=${value}`;
      count++;
    }
    return temp;
  }
  return url;
}

export default function api(
  functionName,
  method,
  token,
  params,
  body,
  options
) {
  let customURL = addParamsToURL(API_URI + functionName, params);

  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("profile")}`,
  };

  const allOptions = { ...headers };
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: customURL,
      data: "hghjgjh",
      headers: allOptions,
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error.response);
      });
  });
}
