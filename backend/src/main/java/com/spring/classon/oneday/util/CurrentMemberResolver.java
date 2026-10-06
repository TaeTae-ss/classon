package com.spring.classon.oneday.util;

import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Map;

public final class CurrentMemberResolver {

    private CurrentMemberResolver() {
    }

    // JWT 인증 필터가 SecurityContext에 담아둔 claims에서 로그인한 회원 번호 추출
    @SuppressWarnings("unchecked")
    public static Long getCurrentMemNo() {

        Map<String, Object> claims = (Map<String, Object>)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return ((Number) claims.get("memNo")).longValue();
    }
}
