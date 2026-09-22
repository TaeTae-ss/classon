package com.spring.classon.common.service;

public interface EmailService {

    // 인증 메일 발송
    void sendEmail(String email, String authCode);

    // 인증번호 확인
    boolean verifyEmail(String email, String authCode);

    // 이메일 인증 여부 확인
    boolean isVerified(String email);
}