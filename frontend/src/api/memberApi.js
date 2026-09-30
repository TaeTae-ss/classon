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

// 이메일 중복 확인
export const checkEmail = async (memEmail) => {
  const response = await axios.get("/api/auth/check-email", {
    params: {
      email: memEmail,
    },
  });

  return response.data.available;
};

// 인증번호 발송
export const sendEmail = async (email) => {
  const response = await axios.post("/api/auth/email/send", null, {
    params: {
      email,
    },
  });

  return response.data;
};

// 이메일 인증번호 확인
export const verifyEmail = async (email, authCode) => {
  const response = await axios.post("/api/auth/email/verify", null, {
    params: {
      email,
      authCode,
    },
  });

  return response.data;
};