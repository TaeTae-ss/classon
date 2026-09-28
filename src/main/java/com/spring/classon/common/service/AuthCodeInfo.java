package com.spring.classon.common.service;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AuthCodeInfo {

    // 인증번호
    private String authCode;
    // 인증번호 만료 시간
    private LocalDateTime expiresAt;
}