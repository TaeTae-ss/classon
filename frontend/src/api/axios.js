import axios from "axios";
import { getCookie, setCookie } from "../util/cookieUtil";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

// 요청 전에 Access Token 추가
api.interceptors.request.use((config) => {

    // 로그인 요청은 토큰 제외
    if (config.url === "/api/auth/login") {
        return config;
    }

    const memberCookie = getCookie("member");

    if (memberCookie?.accessToken) {
        config.headers.Authorization =
            `Bearer ${memberCookie.accessToken}`;
    }

    return config;
});

// Access Token 만료 시 재발급
api.interceptors.response.use(
    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        // 401이면 Access Token 재발급
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "/api/auth/refresh"
        ) {

            originalRequest._retry = true;

            try {
                const memberCookie = getCookie("member");

                // Refresh Token 확인
                if (!memberCookie?.refreshToken) {
                    return Promise.reject(error);
                }

                // Refresh Token으로 Access Token 재발급
                const response = await api.post(
                    "/api/auth/refresh",
                    {
                        refreshToken: memberCookie.refreshToken
                    }
                );

                const newAccessToken = response.data.accessToken;

                // 새 Access Token 저장
                setCookie("member", {
                    ...memberCookie,
                    accessToken: newAccessToken
                });

                // 원래 요청에 새 토큰 적용
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                // 원래 요청 다시 실행
                return api(originalRequest);

            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;