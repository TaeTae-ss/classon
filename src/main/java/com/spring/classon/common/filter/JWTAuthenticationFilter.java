package com.spring.classon.common.filter;

import com.spring.classon.common.util.JWTUtil;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.*;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.*;

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
                var claims = JWTUtil.validateToken(token);

                // 회원 권한 확인
                String role = (String) claims.get("memRole");

                // 권한 생성
                GrantedAuthority authority =
                        new SimpleGrantedAuthority("ROLE_" + role);

                // 인증 정보 생성
                Authentication authentication =
                        new UsernamePasswordAuthenticationToken(
                                claims,
                                null,
                                java.util.List.of(authority)
                        );

                // 인증 정보 저장
                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

            } catch (Exception e) {
                // 잘못된 JWT
                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );
                return;
            }
        }

        // 다음 필터로 전달
        filterChain.doFilter(request, response);
    }
}