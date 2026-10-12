export const money = (value) =>
  `${Number(value || 0).toLocaleString("ko-KR")}원`;