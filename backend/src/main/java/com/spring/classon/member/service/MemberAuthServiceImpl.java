package com.spring.classon.member.service;

import com.spring.classon.common.exception.*;
import com.spring.classon.common.service.EmailService;
import com.spring.classon.common.util.JWTUtil;
import com.spring.classon.member.dto.*;
import com.spring.classon.member.entity.*;
import com.spring.classon.member.mapper.MemberMapper;
import com.spring.classon.member.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberAuthServiceImpl implements MemberAuthService {

    private final MemberRepository memberRepository;
    private final MemberPrivateRepository memberPrivateRepository;
    private final MemberMapper memberMapper;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    // 회원가입
    @Override
    public void signup(SignupRequestDTO requestDto) {

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
            throw new MemberException("이미 사용 중인 이메일입니다.");
        }

        // 이메일 인증 확인
        if (!emailService.isVerified(requestDto.getMemEmail())) {
            throw new IllegalArgumentException(
                    "이메일 인증을 완료해 주세요."
            );
        }

        // 닉네임 중복 확인
        if (memberRepository.existsByMemNickname(requestDto.getMemNickname())) {
            throw new MemberException("이미 사용 중인 닉네임입니다.");
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

    // 로그인
    @Override
    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO requestDto) {

        // 이메일로 회원 조회
        MemberPrivate memberPrivate =
                memberPrivateRepository.findByMemEmail(
                        requestDto.getMemEmail()
                ).orElseThrow(() ->
                        new AuthException(
                                "이메일 또는 비밀번호가 올바르지 않습니다."
                        )
                );

        // 비밀번호 확인
        if (!passwordEncoder.matches(
                requestDto.getMemPassword(),
                memberPrivate.getMemPassword()
        )) {
            throw new AuthException(
                    "이메일 또는 비밀번호가 올바르지 않습니다."
            );
        }

        Member member = memberPrivate.getMember();

        // JWT에 저장할 회원 정보
        Map<String, Object> claims = Map.of(
                "memNo", member.getMemNo(),
                "memEmail", memberPrivate.getMemEmail(),
                "memRole", member.getMemRole()
        );

        // Access Token -> 1시간
        String accessToken =
                JWTUtil.generateToken(claims, 60);

        // Refresh Token -> 7일
        String refreshToken =
                JWTUtil.generateToken(claims, 60 * 24 * 7);

        return LoginResponseDTO.builder()
                .memNo(member.getMemNo())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .memRole(member.getMemRole())
                .build();
    }

    // Access Token 재발급
    @Override
    @Transactional(readOnly = true)
    public String refreshAccessToken(String refreshToken) {

        // Refresh Token 검증
        Map<String, Object> claims =
                JWTUtil.validateToken(refreshToken);

        // 새 Access Token 발급
        return JWTUtil.generateToken(claims, 60);
    }

    // 비밀번호 재설정 인증번호 발송
    @Override
    public void sendPasswordResetEmail(String memEmail) {

        // 가입된 이메일인지 확인
        MemberPrivate memberPrivate =
                memberPrivateRepository.findByMemEmail(memEmail)
                        .orElseThrow(() ->
                                new MemberException(
                                        "가입된 이메일이 없습니다."
                                )
                        );

        // 인증번호 생성
        String authCode = String.valueOf(
                (int) (Math.random() * 900000) + 100000
        );

        emailService.sendPasswordResetEmail(
                memEmail,
                authCode
        );
    }

    // 비밀번호 재설정 인증번호 확인
    @Override
    public boolean verifyPasswordResetEmail(
            String memEmail,
            String authCode
    ) {

        return emailService.verifyPasswordResetEmail(
                memEmail,
                authCode
        );
    }

    // 비밀번호 재설정
    @Override
    public void resetPassword(
            PasswordResetRequestDTO requestDto
    ) {

        // 이메일 인증 확인
        if (!emailService.isPasswordResetVerified(
                requestDto.getMemEmail()
        )) {
            throw new IllegalArgumentException(
                    "이메일 인증을 완료해 주세요."
            );
        }

        // 회원 조회
        MemberPrivate memberPrivate =
                memberPrivateRepository.findByMemEmail(
                        requestDto.getMemEmail()
                ).orElseThrow(() ->
                        new MemberException(
                                "가입된 이메일이 없습니다."
                        )
                );

        // 비밀번호 형식 확인
        String passwordRegex =
                "^(?=.*[A-Za-z])(?=.*\\d).{8,20}$";

        if (!Pattern.matches(
                passwordRegex,
                requestDto.getMemPassword()
        )) {
            throw new IllegalArgumentException(
                    "비밀번호는 영문과 숫자를 포함하여 8~20자로 입력해 주세요."
            );
        }

        // 비밀번호 암호화
        String encodedPassword =
                passwordEncoder.encode(
                        requestDto.getMemPassword()
                );

        // 비밀번호 변경
        memberPrivate.updatePassword(
                encodedPassword,
                LocalDateTime.now()
        );

        // 인증 상태 삭제
        emailService.removePasswordResetVerified(
                requestDto.getMemEmail()
        );
    }
}