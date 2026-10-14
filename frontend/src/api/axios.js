import axios from "axios";
import { getCookie, setCookie } from "../util/cookieUtil";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// 동시에 여러 번 재발급하지 않도록 관리
let refreshPromise = null;

// 요청 인터셉터
api.interceptors.request.use((config) => {
  // 로그인/토큰 재발급 요청에는 기존 Access Token을 넣지 않는다.
  if (
    config.url === "/api/auth/login" ||
    config.url === "/api/auth/refresh"
  ) {
    return config;
  }

  const memberCookie = getCookie("member");
  const accessToken = memberCookie?.accessToken;

  // 유효한 Access Token이 있을 때만 헤더 설정
  if (accessToken && accessToken !== "undefined") {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // HTTP 500 서버 오류 처리
    if (status === 500) {
      window.dispatchEvent(
        new CustomEvent("server-error", {
          detail:
            "서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        })
      );

      return Promise.reject(error);
    }

    // 요청 정보가 없으면 오류 반환
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // 401 오류가 아니거나 이미 재시도한 요청이면 종료
    if (
      status !== 401 ||
      originalRequest._retry ||
      originalRequest.url === "/api/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const memberCookie = getCookie("member");

      // Refresh Token이 없으면 재발급하지 않는다.
      if (!memberCookie?.refreshToken) {
        return Promise.reject(error);
      }

      // 진행 중인 재발급 요청이 없을 때만 새로 요청
      if (!refreshPromise) {
        refreshPromise = api
          .post("/api/auth/refresh", {
            refreshToken: memberCookie.refreshToken,
          })
          .then((response) => {
            // 응답 구조에 맞춰 새 Access Token 추출
            const newAccessToken =
              response.data?.data?.accessToken ??
              response.data?.accessToken;

            if (
              !newAccessToken ||
              newAccessToken === "undefined"
            ) {
              throw new Error(
                "Access Token 재발급 응답에 토큰이 없습니다."
              );
            }

            // 기존 회원 정보와 Refresh Token 유지
            const latestCookie =
              getCookie("member") || memberCookie;

            setCookie(
              "member",
              {
                ...latestCookie,
                accessToken: newAccessToken,
              },
              1
            );

            return newAccessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      // 진행 중인 재발급 결과를 함께 사용
      const newAccessToken = await refreshPromise;

      // 실패했던 원래 요청에 새 Access Token 적용
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      // 원래 요청 재실행
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;