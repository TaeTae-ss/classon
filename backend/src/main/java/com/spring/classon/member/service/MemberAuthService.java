package com.spring.classon.member.service;

import com.spring.classon.member.dto.*;

public interface MemberAuthService {

    // 회원가입
    void signup(SignupRequestDTO requestDto);

    // 이메일 중복 확인
    boolean checkEmail(String memEmail);

    // 닉네임 중복 확인
    boolean checkNickname(String memNickname);

    // 로그인
    LoginResponseDTO login(LoginRequestDTO requestDTO);

    // refreshToken 재발급
    String refreshAccessToken(String refreshToken);

    // 비밀번호 재설정 인증번호 발송
    void sendPasswordResetEmail(String memEmail);

    // 비밀번호 재설정 인증번호 확인
    boolean verifyPasswordResetEmail(
            String memEmail,
            String authCode
    );

    // 비밀번호 재설정
    void resetPassword(
            PasswordResetRequestDTO requestDto
    );
}