package com.spring.classon.oneday.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ScheduleDeletionNotAllowedException extends RuntimeException {

    public ScheduleDeletionNotAllowedException() {
        super("예약자가 있는 일정은 삭제할 수 없습니다.");
    }
}
