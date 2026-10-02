package com.spring.classon.oneday.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class OneDayUpdateNotAllowedException extends RuntimeException {

    public OneDayUpdateNotAllowedException() {
        super("종료된 클래스는 수정할 수 없습니다.");
    }
}
