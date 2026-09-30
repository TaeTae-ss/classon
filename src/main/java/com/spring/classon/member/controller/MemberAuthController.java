package com.spring.classon.member.controller;

import com.spring.classon.member.dto.*;
import com.spring.classon.member.service.MemberAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class MemberAuthController {

    private final MemberAuthService memberAuthService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<Void> signup(
            @RequestBody SignupRequestDTO requestDto) {

        memberAuthService.signup(requestDto);

        return ResponseEntity.ok().build();
    }

    // 이메일 중복 확인
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(
            @RequestParam String email) {

        boolean available = memberAuthService.checkEmail(email);

        return ResponseEntity.ok(
                Map.of("available", available)
        );
    }

    // 닉네임 중복 확인
    @GetMapping("/check-nickname")
    public ResponseEntity<Map<String, Boolean>> checkNickname(
            @RequestParam String nickname) {

        boolean available = memberAuthService.checkNickname(nickname);

        return ResponseEntity.ok(
                Map.of("available", available)
        );
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody LoginRequestDTO requestDto) {

        LoginResponseDTO responseDTO =
                memberAuthService.login(requestDto);

        return ResponseEntity.ok(responseDTO);
    }

    // Access Token 재발급
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(
            @RequestBody Map<String, String> request) {

        String refreshToken = request.get("refreshToken");

        String accessToken =
                memberAuthService.refreshAccessToken(refreshToken);

        return ResponseEntity.ok(
                Map.of("accessToken", accessToken)
        );
    }

    // 비밀번호 재설정 인증번호 발송
    @PostMapping("/password/send")
    public ResponseEntity<Void> sendPasswordResetEmail(
            @RequestParam String email) {

        memberAuthService.sendPasswordResetEmail(email);

        return ResponseEntity.ok().build();
    }

    // 비밀번호 재설정 인증번호 확인
    @PostMapping("/password/verify")
    public ResponseEntity<Boolean> verifyPasswordResetEmail(
            @RequestParam String email,
            @RequestParam String authCode) {

        boolean result =
                memberAuthService.verifyPasswordResetEmail(
                        email,
                        authCode
                );

        return ResponseEntity.ok(result);
    }

    // 비밀번호 재설정
    @PatchMapping("/password")
    public ResponseEntity<Void> resetPassword(
            @RequestBody PasswordResetRequestDTO requestDto) {

        memberAuthService.resetPassword(requestDto);

        return ResponseEntity.ok().build();
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {

        return ResponseEntity.ok().build();
    }
}