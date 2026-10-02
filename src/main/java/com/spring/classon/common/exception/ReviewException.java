package com.spring.classon.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// 후기 도메인에서 발생하는 예외 처리
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ReviewException extends RuntimeException {

    public ReviewException(String message) {
        super(message);
    }
}