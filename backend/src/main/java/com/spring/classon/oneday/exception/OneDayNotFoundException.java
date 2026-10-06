package com.spring.classon.oneday.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class OneDayNotFoundException extends RuntimeException {

    public OneDayNotFoundException() {
        super("클래스를 찾을 수 없습니다.");
    }
}
