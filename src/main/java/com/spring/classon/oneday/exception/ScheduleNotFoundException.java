package com.spring.classon.oneday.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ScheduleNotFoundException extends RuntimeException {

    public ScheduleNotFoundException() {
        super("일정을 찾을 수 없습니다.");
    }
}
