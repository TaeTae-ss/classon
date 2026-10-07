package com.spring.classon.common.config;

import com.spring.classon.common.filter.JWTAuthenticationFilter;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.*;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.*;
import org.springframework.web.cors.*;

import java.util.*;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    // CORS 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // React 주소 허용
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

    // 공통 보안 설정
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
                                "/api/auth/login",
                                "/uploads/oneday/**",
                                "/api/v1/oneday/**",
                                "/api/auth/password/**",
                                "/api/auth/refresh",
                                "/api/reservation",
                                "/api/reservation/**",
                                "/api/payment",
                                "/api/notices/**",
                                "/api/payment/**"
                        ).permitAll()

                        // 그 외 요청은 인증 필요
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