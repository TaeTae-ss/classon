package com.spring.classon.common.filter;

import com.spring.classon.common.util.JWTUtil;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;

public class JWTAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Authorization 헤더 확인
        String authHeader = request.getHeader("Authorization");

        // JWT 확인
        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            // Bearer 뒤의 JWT 추출
            String token = authHeader.substring(7);

            try {
                // JWT 검증
                Map<String, Object> claims = JWTUtil.validateToken(token);

                // 인증 정보 생성
                Authentication authentication =
                        new UsernamePasswordAuthenticationToken(
                                claims,
                                null,
                                Collections.emptyList()
                        );

                // 인증 정보 저장
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                // 잘못된 JWT
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        // 다음 필터로 요청 전달
        filterChain.doFilter(request, response);
    }
}