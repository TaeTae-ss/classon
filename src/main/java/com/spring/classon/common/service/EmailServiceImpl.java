package com.spring.classon.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    // 인증 메일 발송
    @Override
    public void sendEmail(String email, String authCode) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("[ClassOn] 회원가입을 위한 인증번호 안내 메일");
        message.setText(
                "인증번호는 [" + authCode + "]입니다."
        );

        mailSender.send(message);
    }
}