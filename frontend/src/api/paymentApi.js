import axios from "./axios";

// 결제 생성
export const createPayment = async (rsvNo) => {
  const response = await axios.post("/api/payment", {
    rsvNo,
  });

  return response.data.data;
};

// 결제 승인
export const confirmPayment = async (data) => {
  const response = await axios.post("/api/payment/confirm", data);

  return response.data.data;
};

// 결제 상세
export const getPayment = async (payNo) => {
  const response = await axios.get(`/api/payment/${payNo}`);

  return response.data.data;
};

// 결제 실패
export const failPayment = async (orderNo) => {
  const response = await axios.patch(`/api/payment/order/${orderNo}/fail`);

  return response.data.data;
};

// 결제 취소
export const cancelPayment = async (rsvNo) => {
  const response = await axios.patch(
    `/api/payment/reservation/${rsvNo}/cancel`
  );

  return response.data.data;
};

// 예약별 결제 이력
export const getPaymentsByReservation = async (rsvNo) => {
  const response = await axios.get(
    `/api/payment/reservation/${rsvNo}`
  );

  return response.data.data;
};