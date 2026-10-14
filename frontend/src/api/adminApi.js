import axios from "./axios";

// 강사 신청 목록 조회
export const getAdminInstructorList = async () => {
  const response = await axios.get("/api/admin/instructor");
  return response.data;
};

// 강사 신청 증빙자료 조회
export const getAdminInstructorDocuments = async (reqNo) => {
  const response = await axios.get(
    `/api/admin/instructor/${reqNo}/documents`,
  );
  return response.data;
};

// 강사 신청 증빙자료 파일 조회
export const getAdminInstructorDocument = async (reqNo, docNo) => {
  const response = await axios.get(
    `/api/admin/instructor/${reqNo}/documents/${docNo}/file`,
    { responseType: "blob" },
  );

  return response.data;
};

// 강사 신청 승인 및 반려
export const updateAdminInstructorStatus = async (
  reqNo,
  reqStatus,
  rejReason = "",
) => {
  const response = await axios.patch(
    `/api/admin/instructor/${reqNo}/status`,
    {
      reqStatus,
      ...(reqStatus === "REJECTED" ? { rejReason } : {}),
    },
  );

  return response.data;
};

// 관리자 회원 목록 조회
export const getAdminMemberList = async (params = {}) => {
  const response = await axios.get("/api/admin/members", {
    params,
  });

  return response.data;
};

// 관리자 회원 상세 조회
export const getAdminMemberDetail = async (memNo) => {
  const response = await axios.get(`/api/admin/members/${memNo}`);
  return response.data;
};

// 관리자 클래스 목록 조회 및 검색
export const getAdminClassList = async (params = {}) => {
  const response = await axios.get("/api/admin/classes", {
    params,
  });

  return response.data;
};