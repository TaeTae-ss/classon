import api from "./axios";

const noticePrefix = "/api/notices";
const adminNoticePrefix = "/api/admin/notices";

// 공지사항 목록
export const getNoticeList = async ({
  page = 1,
  size = 10,
  keyword = "",
} = {}) => {
  const res = await api.get(noticePrefix, {
    params: {
      page,
      size,
      keyword,
    },
  });

  return res.data;
};

// 공지사항 상세
export const getNotice = async (notNo) => {
  const res = await api.get(
    `${noticePrefix}/${notNo}`
  );

  return res.data;
};

// 관리자 공지사항 등록
export const postNotice = async (notice) => {
  const res = await api.post(
    adminNoticePrefix,
    notice
  );

  return res.data;
};

// 관리자 공지사항 수정
export const putNotice = async (notNo, notice) => {
  const res = await api.put(
    `${adminNoticePrefix}/${notNo}`,
    notice
  );

  return res.data;
};

// 관리자 공지사항 삭제
export const deleteNotice = async (notNo) => {
  const res = await api.delete(
    `${adminNoticePrefix}/${notNo}`
  );

  return res.data;
};