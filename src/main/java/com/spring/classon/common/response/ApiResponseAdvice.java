package com.spring.classon.common.response;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

// 성공 응답을 ApiResponse로 감싸는 전역 처리 (이미 ApiResponse인 경우, 예: GlobalExceptionHandler의 에러 응답은 그대로 통과)
@RestControllerAdvice
public class ApiResponseAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                   Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                   ServerHttpRequest request, ServerHttpResponse response) {

        if (body instanceof ApiResponse<?>) {
            return body;
        }

        int status = (response instanceof ServletServerHttpResponse servletResponse)
                ? servletResponse.getServletResponse().getStatus()
                : HttpStatus.OK.value();

        return new ApiResponse<>(true, status, body);
    }
}
