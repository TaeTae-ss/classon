package com.spring.classon.common.config;

import com.spring.classon.common.filter.JWTAuthenticationFilter;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.*;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.*;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // 로그인 없이 접근 가능
                        .requestMatchers(
                                "/api/auth/signup",
                                "/api/auth/check-email",
                                "/api/auth/check-nickname",
                                "/api/auth/email/**",
                                "/api/auth/login"
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