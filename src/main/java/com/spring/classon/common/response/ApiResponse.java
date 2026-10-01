package com.spring.classon.common.response;

import org.springframework.http.HttpStatus;

public record ApiResponse<T>(boolean success, int code, T data) {

    public static <T> ApiResponse<T> success(T data) {
        return success(HttpStatus.OK, data);
    }

    public static <T> ApiResponse<T> success(HttpStatus status, T data) {
        return new ApiResponse<>(true, status.value(), data);
    }

    public static ApiResponse<ErrorPayload> error(int code, String message) {
        return new ApiResponse<>(false, code, new ErrorPayload(message));
    }

    public record ErrorPayload(String message) {
    }
}
