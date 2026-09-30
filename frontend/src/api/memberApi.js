import axios from "./axios";

// 로그인
export const loginPost = async (loginData) => {
  const response = await axios.post("/api/auth/login", loginData);
  return response.data;
};

// 로그아웃
export const logoutPost = async () => {
  const response = await axios.post("/api/auth/logout");
  return response.data;
};

// 회원가입
export const signupPost = async (signupData) => {
  const response = await axios.post("/api/auth/signup", signupData);

  return response.data;
};