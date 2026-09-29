import axios from "axios";

const prefix = "http://localhost:8080/api/auth";

// 로그인
export const loginPost = async (loginData) => {
  const response = await axios.post(`${prefix}/login`, {
    memEmail: loginData.memEmail,
    memPassword: loginData.memPassword,
  });

  return response.data;
};

// 로그아웃
export const logoutPost = async () => {
  const response = await axios.post(`${prefix}/logout`);
  return response.data;
};