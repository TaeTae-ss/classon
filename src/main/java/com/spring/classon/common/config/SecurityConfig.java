package com.spring.classon.common.config;

import com.spring.classon.common.filter.JWTAuthenticationFilter;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.*;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.*;
import org.springframework.web.cors.*;

import java.util.*;

@Configuration
public class SecurityConfig {

    // CORS 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // React 주소 허용(현재는 모든 주소 허용)
        // 배포시 실제 주소로 바꿔야 함!
        configuration.setAllowedOriginPatterns(List.of("*"));

        // 요청 방식 허용
        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        // 요청 헤더 허용
        configuration.setAllowedHeaders(List.of("*"));

        // 쿠키 인증 허용
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // 권한 설정
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // 로그인 없이 접근 가능
                        .requestMatchers(
                                "/api/auth/signup",
                                "/api/auth/check-email",
                                "/api/auth/check-nickname",
                                "/api/auth/email/**",
                                "/api/auth/check-email",
                                "/api/auth/login",
                                "/api/auth/password/**",
                                "/api/auth/refresh"
                        ).permitAll()

                        // 회원 접근 가능(강사, 관리자 포함)
                        .requestMatchers(
                                "/api/member/**",
                                "/api/auth/logout"
                        ).hasAnyRole(
                                "USER",
                                "INSTRUCTOR",
                                "ADMIN"
                        )

                        // 강사 신청 관련(회원만 접근 가능)
                        .requestMatchers(
                                "/api/instructor/*",
                                "/api/instructor/*/documents"
                        ).hasRole("USER")

                        // 강사 접근 가능(관리자 포함)
                        .requestMatchers(
                                "/api/instructor/class/**"
                        ).hasAnyRole(
                                "INSTRUCTOR",
                                "ADMIN"
                        )

                        // 관리자만 접근 가능
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // 그 외 요청
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        new JWTAuthenticationFilter(),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // 비밀번호 암호화
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}