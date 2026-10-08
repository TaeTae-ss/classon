import api from "./axios";

// 후기 등록
export const postReview = async (review) => {
    const response = await api.post("/api/reviews", review);

    return response.data;
};

// 내가 작성한 후기 조회
export const getMemberReviews = async () => {
    const response = await api.get("/api/reviews/member");

    return response.data.data;
};

// 후기 삭제
export const deleteReview = async (revNo) => {
  const response = await api.delete(`/api/reviews/${revNo}`);

  return response.data;
};

// 클래스별 후기 조회
export const getClassReviews = async (clsNo, sort = "latest") => {
  const response = await api.get(`/api/reviews/class/${clsNo}`, {
    params: { sort },
  });

  return response.data.data;
};

// 강사 본인이 등록한 클래스 목록 조회
export const getInstructorClasses = async () => {
  const response = await api.get("/api/v1/oneday/mine");
  return response.data;
};

