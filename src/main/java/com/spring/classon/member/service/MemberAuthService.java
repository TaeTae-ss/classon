package com.spring.classon.member.service;

import com.spring.classon.member.dto.SignupRequestDto;

public interface MemberAuthService {

    // 회원가입
    void signup(SignupRequestDto requestDto);

    // 이메일 중복 확인
    boolean checkEmail(String memEmail);

    // 닉네임 중복 확인
    boolean checkNickname(String memNickname);
}