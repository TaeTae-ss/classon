package com.spring.classon.common.service;

public interface EmailService {

    // 인증 메일 발송
    void sendEmail(String email, String authCode);
}