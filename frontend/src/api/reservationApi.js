import axios from "./axios";

// 예약 생성
export const createReservation = async (data) => {
  const response = await axios.post("/api/reservation", data);
  return response.data.data;
};

// 예약 상세
export const getReservation = async (rsvNo) => {
  const response = await axios.get(`/api/reservation/${rsvNo}`);
  return response.data.data;
};

// 예약 목록
export const getReservationList = async () => {
  const response = await axios.get("/api/reservation");
  return response.data.data;
};

// 회원 예약 목록
export const getReservationListByMember = async (memNo) => {
  const response = await axios.get(`/api/reservation/member/${memNo}`);
  return response.data.data;
};

// 예약 취소
export const cancelReservation = async (rsvNo, rsvCancelReason) => {
  const response = await axios.patch(
    `/api/reservation/${rsvNo}/cancel`,
    { rsvCancelReason }
  );
  return response.data.data;
};

// 예약 인원 / 금액 확인
export const countReservation = async (schNo, rsvCount) => {
  const response = await axios.get("/api/reservation/count", {
    params: {
      schNo,
      rsvCount,
    },
  });

  return response.data.data;
};