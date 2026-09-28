package com.spring.classon.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final Map<String, AuthCodeInfo> authCodeMap = new ConcurrentHashMap<>();
    // 인증 완료 이메일 저장
    private final Set<String> verifiedEmails = ConcurrentHashMap.newKeySet();


    // 인증 메일 발송
    @Override
    public void sendEmail(String email, String authCode) {

        // 인증번호 저장
        saveAuthCode(email, authCode);

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("[ClassOn] 회원가입을 위한 인증번호 안내 메일");
        message.setText(
                "인증번호는 [" + authCode + "]입니다."
        );

        mailSender.send(message);
    }

    // 인증번호 저장
    public void saveAuthCode(String email, String authCode) {

        authCodeMap.put(
                email,
                new AuthCodeInfo(
                        authCode,
                        LocalDateTime.now().plusMinutes(5)
                )
        );
    }

    // 인증번호 확인
    @Override
    public boolean verifyEmail(String email, String authCode) {

        AuthCodeInfo info = authCodeMap.get(email);

        // 인증번호가 없는 경우
        if (info == null) {
            return false;
        }

        // 인증번호가 만료된 경우
        if (LocalDateTime.now().isAfter(info.getExpiresAt())) {
            authCodeMap.remove(email);
            return false;
        }

        // 인증번호가 다른 경우
        if (!info.getAuthCode().equals(authCode)) {
            return false;
        }

        // 인증 성공 후 인증번호 삭제
        authCodeMap.remove(email);

        // 인증 완료 처리
        verifiedEmails.add(email);

        return true;
    }

    // 이메일 인증 여부 확인
    @Override
    public boolean isVerified(String email) {
        return verifiedEmails.contains(email);
    }
}