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

// 회원가입 파트
// 이메일 중복 확인
export const checkEmail = async (email) => {
  const response = await axios.get("/api/auth/check-email", {
    params: { email },
  });

  return response.data.data;
};

// 닉네임 중복 확인
export const checkNickname = async (nickname) => {
  const response = await axios.get("/api/auth/check-nickname", {
    params: { nickname },
  });

  return response.data.data;
};

// 회원가입
export const signupPost = async (signupData) => {
  const response = await axios.post("/api/auth/signup", signupData);
  return response.data;
};

// 마이페이지 파트
// 회원 정보 조회
export const getMember = async (memNo) => {
  const response = await axios.get(`/api/member/${memNo}`);
  return response.data;
};

// 회원 정보 수정
export const updateMember = async (memNo, memberData) => {
  const response = await axios.patch(`/api/member/${memNo}`, memberData);
  return response.data;
};

// 프로필 이미지 수정
export const updateProfileImage = async (memNo, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.patch(
    `/api/member/${memNo}/image`,
    formData
  );

  return response.data;
};