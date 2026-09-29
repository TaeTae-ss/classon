package com.spring.classon.sgUserTests;

import com.spring.classon.common.util.JWTUtil;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class JWTAuthenticationTests {

    // JWT 생성 테스트
    @Test
    void generateTokenTest() {

        Map<String, Object> claims = Map.of(
                "memNo", 49L,
                "memEmail", "sujung11@naver.com"
        );

        String token = JWTUtil.generateToken(claims, 60);

        assertNotNull(token);

        System.out.println("========================================");
        System.out.println("JWT 생성 테스트");
        System.out.println("결과 : 성공");
        System.out.println("JWT : " + token);
        System.out.println("========================================");
    }

    // JWT 검증 테스트
    @Test
    void validateTokenTest() {

        Map<String, Object> claims = Map.of(
                "memNo", 49L,
                "memEmail", "sujung11@naver.com"
        );

        String token = JWTUtil.generateToken(claims, 60);

        Map<String, Object> result = JWTUtil.validateToken(token);

        assertNotNull(result);
        assertEquals(49L, ((Number) result.get("memNo")).longValue());
        assertEquals("sujung11@naver.com", result.get("memEmail"));

        System.out.println("========================================");
        System.out.println("JWT 검증 테스트");
        System.out.println("결과 : 성공");
        System.out.println("회원번호 : " + result.get("memNo"));
        System.out.println("이메일 : " + result.get("memEmail"));
        System.out.println("========================================");
    }
}