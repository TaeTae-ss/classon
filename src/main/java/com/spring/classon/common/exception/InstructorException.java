package com.spring.classon.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// 강사 신청 관련 예외 처리
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InstructorException extends RuntimeException {

    public InstructorException(String message) {
        super(message);
    }
}