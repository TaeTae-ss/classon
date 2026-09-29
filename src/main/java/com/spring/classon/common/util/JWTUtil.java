package com.spring.classon.common.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class JWTUtil {

    // JWT 서명에 사용할 비밀키
    private static final String SECRET_KEY =
            "classon-jwt-secret-key-for-springboot-2026";

    // 문자열 비밀키를 SecretKey로 변환
    private static final SecretKey KEY =
            Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    // JWT 생성
    public static String generateToken(Map<String, Object> claims, int min) {

        return Jwts.builder()
                .claims(claims)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + (1000L * 60 * min))
                )
                .signWith(KEY)
                .compact();
    }

    // JWT 검증
    public static Map<String, Object> validateToken(String token) {

        Claims claims = Jwts.parser()
                .verifyWith(KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims;
    }
}