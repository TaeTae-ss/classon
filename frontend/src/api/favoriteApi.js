import api from "./axios";

// 로그인 회원의 찜 목록 조회
export const getFavorites = async () => {
  const response = await api.get("/api/favorites");
  return response.data.data;
};

// 찜 등록
export const postFavorite = async (clsNo) => {
  const response = await api.post("/api/favorites", { clsNo });
  return response.data;
};

// 찜 취소
export const deleteFavorite = async (favNo) => {
  const response = await api.delete(`/api/favorites/${favNo}`);
  return response.data;
};