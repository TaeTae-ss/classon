package com.spring.classon.member.controller;

import com.spring.classon.member.dto.SignupRequestDto;
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
            @RequestBody SignupRequestDto requestDto) {

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
}