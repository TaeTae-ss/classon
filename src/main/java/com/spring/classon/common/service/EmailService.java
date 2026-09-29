package com.spring.classon.common.service;

public interface EmailService {

    // 인증 메일 발송
    void sendEmail(String email, String authCode);

    // 인증번호 확인
    boolean verifyEmail(String email, String authCode);

    // 이메일 인증 여부 확인
    boolean isVerified(String email);

    // 비밀번호 재설정 인증번호 발송
    void sendPasswordResetEmail(String email, String authCode);

    // 비밀번호 재설정 인증번호 확인
    boolean verifyPasswordResetEmail(String email, String authCode);

    // 비밀번호 재설정 인증 여부 확인
    boolean isPasswordResetVerified(String email);

    // 비밀번호 재설정 인증 상태 삭제
    void removePasswordResetVerified(String email);
}