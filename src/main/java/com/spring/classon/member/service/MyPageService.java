package com.spring.classon.member.service;

import org.springframework.security.core.Authentication;

public interface MyPageService {

    // 내 회원번호 조회
    Long getMyNo(Authentication authentication);
}