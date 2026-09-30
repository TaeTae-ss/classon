import axios from "axios";
import { getCookie } from "../util/cookieUtil";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// 요청 전에 Access Token 추가
api.interceptors.request.use((config) => {

  const memberCookie = getCookie("member");

  if (memberCookie?.accessToken) {
    config.headers.Authorization = `Bearer ${memberCookie.accessToken}`;
  }

  return config;
});

export default api;