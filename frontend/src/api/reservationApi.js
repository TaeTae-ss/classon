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
  const response = await axios.get("/api/reservation/my");
  return response.data.data;
};

// 회원 예약 목록
export const getReservationListByMember = async () => {
  const response = await axios.get("/api/reservation/my");
  return response.data.data;
};

// 로그인 강사가 등록한 클래스의 예약 목록
export const getInstructorReservationList = async () => {
  const response = await axios.get("/api/reservation/instructor/my");
  return response.data.data;
};

// 로그인 강사가 등록한 특정 일정의 예약 목록
export const getInstructorReservationListBySchedule = async (schNo) => {
  const response = await axios.get(
    `/api/reservation/instructor/schedule/${schNo}`
  );
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