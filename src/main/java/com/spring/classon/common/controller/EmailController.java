package com.spring.classon.common.controller;

import com.spring.classon.common.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    // 인증 메일 발송
    @PostMapping("/send")
    public void sendEmail(@RequestParam String email) {

        // 인증번호 생성
        String authCode = String.valueOf(
                (int) (Math.random() * 900000) + 100000
        );

        emailService.sendEmail(email, authCode);
    }
}