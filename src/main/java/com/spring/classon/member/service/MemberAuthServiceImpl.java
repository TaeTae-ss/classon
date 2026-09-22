package com.spring.classon.member.service;

import com.spring.classon.member.dto.SignupRequestDto;
import com.spring.classon.member.entity.*;
import com.spring.classon.member.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberAuthServiceImpl implements MemberAuthService {

    private final MemberRepository memberRepository;
    private final MemberPrivateRepository memberPrivateRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원가입
    @Override
    public void signup(SignupRequestDto requestDto) {

        // 이메일 중복 확인
        if (memberPrivateRepository.existsByMemEmail(requestDto.getMemEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 닉네임 중복 확인
        if (memberRepository.existsByMemNickname(requestDto.getMemNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        // 비밀번호 형식 확인
        String passwordRegex = "^(?=.*[A-Za-z])(?=.*\\d).{8,20}$";

        if (!Pattern.matches(passwordRegex, requestDto.getMemPassword())) {
            throw new IllegalArgumentException(
                    "비밀번호는 영문과 숫자를 포함한 8~20자여야 합니다."
            );
        }

        // 비밀번호 암호화
        String encodedPassword =
                passwordEncoder.encode(requestDto.getMemPassword());

        // 회원 기본 정보 저장
        Member member = Member.builder()
                .memNickname(requestDto.getMemNickname())
                .memCreatedAt(LocalDateTime.now())
                .memRole("MEMBER")
                .build();

        memberRepository.save(member);

        // 회원 개인정보 저장
        MemberPrivate memberPrivate = MemberPrivate.builder()
                .member(member)
                .memEmail(requestDto.getMemEmail())
                .memPassword(encodedPassword)
                .memPhone(requestDto.getMemPhone())
                .memAddress(requestDto.getMemAddress())
                .memPwUpdate(LocalDateTime.now())
                .build();

        memberPrivateRepository.save(memberPrivate);
    }

    // 이메일 중복 확인
    @Override
    @Transactional(readOnly = true)
    public boolean checkEmail(String memEmail) {
        return !memberPrivateRepository.existsByMemEmail(memEmail);
    }

    // 닉네임 중복 확인
    @Override
    @Transactional(readOnly = true)
    public boolean checkNickname(String memNickname) {
        return !memberRepository.existsByMemNickname(memNickname);
    }
}