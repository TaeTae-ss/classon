import axios from "./axios";

// 로그인
export const loginPost = async (loginData) => {
  const response = await axios.post("/api/auth/login", loginData);
  return response.data.data;
};

// 로그아웃
export const logoutPost = async () => {
  const response = await axios.post("/api/auth/logout");
  return response.data.data;
};

// 비밀번호 재설정 인증번호 발송
export const passwordSendPost = async (email) => {
  const response = await axios.post("/api/auth/password/send", null, {
    params: { email },
  });

  return response.data;
};

// 비밀번호 재설정 인증번호 확인
export const passwordVerifyPost = async (email, authCode) => {
  const response = await axios.post("/api/auth/password/verify", null, {
    params: {
      email,
      authCode,
    },
  });

  return response.data;
};

// 비밀번호 재설정
export const passwordPatch = async (data) => {
  const response = await axios.patch("/api/auth/password", data);
  return response.data;
};