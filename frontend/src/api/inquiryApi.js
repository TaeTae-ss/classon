import axios from "./axios";

// 관리자 문의 목록
export const getAdminInquiryList = async (params = {}) => {
  const response = await axios.get("/api/admin/inquiry", {
    params,
  });

  return response.data.data;
};

// 관리자 문의 상세
export const getAdminInquiry = async (repNo) => {
  const response = await axios.get(
    `/api/admin/inquiry/${repNo}`
  );

  return response.data.data;
};

// 문의 상태 변경
export const modifyInquiryStatus = async (repNo, inqStatus) => {
  const response = await axios.patch(
    `/api/admin/inquiry/${repNo}/status`,
    {
      inqStatus,
    }
  );

  return response.data.data;
};

// 관리자 답변 등록/수정
export const modifyInquiryComment = async (repNo, admComment) => {
  const response = await axios.patch(
    `/api/admin/inquiry/${repNo}/comment`,
    {
      admComment,
    }
  );

  return response.data.data;
};