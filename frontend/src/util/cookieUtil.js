import { Cookies } from "react-cookie";

const cookies = new Cookies();

// 쿠키 저장
export const setCookie = (name, value, days) => {
  cookies.set(name, value, {
    path: "/",
    maxAge: 60 * 60 * 24 * days,
  });
};

// 쿠키 조회
export const getCookie = (name) => {
  return cookies.get(name);
};

// 쿠키 삭제
export const removeCookie = (name) => {
  cookies.remove(name, {
    path: "/",
  });
};