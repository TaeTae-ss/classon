package com.spring.classon.member.service;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class MyPageServiceImpl implements MyPageService {

    // 내 회원번호 조회
    @Override
    public Long getMyNo(Authentication authentication) {

        Map<?, ?> claims = (Map<?, ?>) authentication.getPrincipal();

        return ((Number) claims.get("memNo")).longValue();
    }
}