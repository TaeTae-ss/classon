import axios from "./axios";

// 강사 신청
export const applyInstructor = async (memNo, instructorData) => {
  const response = await axios.post(
    `/api/instructor/${memNo}`,
    instructorData
  );

  return response.data;
};

// 회원별 강사 신청 조회
export const getInstructorRequestByMemNo = async (memNo) => {
  const response = await axios.get(
    `/api/instructor/member/${memNo}`
  );

  return response.data;
};

// 강사 신청 증빙자료 업로드
export const uploadInstructorDocument = async (reqNo, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `/api/instructor/${reqNo}/documents`,
    formData
  );

  return response.data;
};