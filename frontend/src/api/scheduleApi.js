import axios from "./axios";

export const getSchedules = async (clsNo) => {
  const response = await axios.get(
    `/api/v1/oneday/${clsNo}/schedules`
  );

  return response.data.data;
};