import axios from "./axios";

// 공지사항 목록
export const getNoticeList = async (page = 1, keyword = "") => {
  const response = await axios.get("/api/notices", {
    params: {
      page,
      size: 8,
      keyword,
    },
  });

  return response.data.data;
};

// 공지사항 상세
export const getNotice = async (notNo) => {
  const response = await axios.get(`/api/notices/${notNo}`);
  return response.data.data;
};

// 관리자 - 공지사항 등록
export const registerNotice = async (data) => {
  const response = await axios.post("/api/admin/notices", data);
  return response.data.data;
};

// 관리자 - 공지사항 수정
export const modifyNotice = async (notNo, data) => {
  const response = await axios.put(
    `/api/admin/notices/${notNo}`,
    data,
  );

  return response.data.data;
};

// 관리자 - 공지사항 삭제
export const deleteNotice = async (notNo) => {
  const response = await axios.delete(
    `/api/admin/notices/${notNo}`,
  );

  return response.data.data;
};