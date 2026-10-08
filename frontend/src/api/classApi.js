import api from "./axios";

export const getClassDetail = async (clsNo) => {
  const response = await api.get(`/api/v1/oneday/${clsNo}`);
  return response.data.data;
};

export const registerClass = async (dto, image) => {
  const formData = new FormData();
  formData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
  formData.append("image", image);

  const response = await api.post("/api/v1/oneday", formData);
  return response.data.data;
};
