package com.spring.classon.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// 회원 도메인에서 발생하는 예외 처리
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class MemberException extends RuntimeException {

    public MemberException(String message) {
        super(message);
    }
}