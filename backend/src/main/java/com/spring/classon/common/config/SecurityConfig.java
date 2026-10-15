
package com.spring.classon.common.config;

import com.spring.classon.common.filter.JWTAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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

        source.registerCorsConfiguration("/**", configuration);

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
                                "/api/auth/logout",
                                "/uploads/oneday/**",
                                "/uploads/member/**",
                                "/api/v1/oneday/**",
                                "/api/v1/categories",
                                "/api/reviews/class/**",
                                "/api/auth/password/**",
                                "/api/auth/refresh",
                                "/api/notices/**"
                        ).permitAll()

                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")

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
