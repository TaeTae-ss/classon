import axios from "./axios";

export const getSchedules = async (clsNo) => {
  const response = await axios.get(
    `/api/v1/oneday/${clsNo}/schedules`
  );

  return response.data.data;
};

export const registerSchedule = async (clsNo, dto) => {
  const response = await axios.post(
    `/api/v1/oneday/${clsNo}/schedules`,
    dto
  );

  return response.data.data;
};

export const deleteSchedule = async (clsNo, schNo) => {
  await axios.delete(`/api/v1/oneday/${clsNo}/schedules/${schNo}`);
};