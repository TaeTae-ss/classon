package com.spring.classon.common.exception;

import com.spring.classon.common.response.ApiResponse;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 잘못된 요청 (존재하지 않는 리소스 참조 등)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<ApiResponse.ErrorPayload>> handleIllegalArgumentException(IllegalArgumentException e) {
        return build(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    // 현재 상태에서 허용되지 않는 요청 (상태 전이 위반 등)
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<ApiResponse.ErrorPayload>> handleIllegalStateException(IllegalStateException e) {
        return build(HttpStatus.CONFLICT, e.getMessage());
    }

    // @ResponseStatus가 붙은 커스텀 예외 (각 예외에 지정된 상태 코드 그대로 사용)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<ApiResponse.ErrorPayload>> handleRuntimeException(RuntimeException e) {

        ResponseStatus responseStatus =
                AnnotatedElementUtils.findMergedAnnotation(e.getClass(), ResponseStatus.class);

        HttpStatus status = responseStatus != null ? responseStatus.value() : HttpStatus.INTERNAL_SERVER_ERROR;

        return build(status, e.getMessage());
    }

    // Validation 유효성 검사 실패
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<ApiResponse.ErrorPayload>> handleValidationException(MethodArgumentNotValidException e) {

        String message = e.getBindingResult()
                .getFieldErrors()
                .get(0)
                .getDefaultMessage();

        return build(HttpStatus.BAD_REQUEST, message);
    }

    // 그 외 예상하지 못한 예외
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<ApiResponse.ErrorPayload>> handleException(Exception e) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다.");
    }

    private ResponseEntity<ApiResponse<ApiResponse.ErrorPayload>> build(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(ApiResponse.error(status.value(), message));
    }
}
