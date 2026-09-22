package com.spring.classon.member.service;

import com.spring.classon.member.dto.SignupRequestDto;
import com.spring.classon.member.entity.*;
import com.spring.classon.member.mapper.MemberMapper;
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
    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;

    // 회원가입
    @Override
    public void signup(SignupRequestDto requestDto) {

        // 이메일 형식 확인
        String emailRegex =
                "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

        if (!Pattern.matches(emailRegex, requestDto.getMemEmail())) {
            throw new IllegalArgumentException(
                    "올바른 이메일 형식으로 입력해 주세요."
            );
        }

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
                    "비밀번호는 영문과 숫자를 포함하여 8~20자로 입력해 주세요."
            );
        }

        // 비밀번호 암호화
        String encodedPassword =
                passwordEncoder.encode(requestDto.getMemPassword());

        // 회원 기본 정보 저장
        Member member = memberMapper.toEntity(requestDto);

        memberRepository.save(member);

        // 회원 개인정보 저장
        MemberPrivate memberPrivate =
                memberMapper.toPrivateEntity(
                        requestDto,
                        member,
                        encodedPassword
                );

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