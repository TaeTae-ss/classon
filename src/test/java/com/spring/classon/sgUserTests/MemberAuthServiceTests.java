package com.spring.classon.sgUserTests;

import com.spring.classon.member.dto.SignupRequestDto;
import com.spring.classon.member.entity.*;
import com.spring.classon.member.repository.*;
import com.spring.classon.member.service.MemberAuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class MemberAuthServiceTests {

    @Autowired
    private MemberAuthService memberAuthService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MemberPrivateRepository memberPrivateRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void 회원가입_테스트() {

        // 회원가입 정보
        SignupRequestDto requestDto = SignupRequestDto.builder()
                .memNickname("수정")
                .memEmail("su11@naver.com")
                .memPassword("sujung1234")
                .memPhone("010-8115-3251")
                .memAddress("수원시")
                .build();

        // 회원가입
        memberAuthService.signup(requestDto);

        // 회원 조회
        Member member = memberRepository
                .findAll()
                .stream()
                .filter(m -> m.getMemNickname().equals("수정"))
                .findFirst()
                .orElseThrow();

        // 회원 개인정보 조회
        MemberPrivate memberPrivate =
                memberPrivateRepository.findById(member.getMemNo())
                        .orElseThrow();

        // 비밀번호 암호화 확인
        boolean passwordMatches = passwordEncoder.matches(
                "sujung1234",
                memberPrivate.getMemPassword()
        );

        // 결과 출력
        System.out.println("========== 회원가입 테스트 ==========");
        System.out.println("회원번호 : " + member.getMemNo());
        System.out.println("닉네임 : " + member.getMemNickname());
        System.out.println("이메일 : " + memberPrivate.getMemEmail());
        System.out.println("전화번호 : " + memberPrivate.getMemPhone());
        System.out.println("주소 : " + memberPrivate.getMemAddress());
        System.out.println("권한 : " + member.getMemRole());
        System.out.println("암호화된 비밀번호 : " + memberPrivate.getMemPassword());
        System.out.println("비밀번호 일치 여부 : " + passwordMatches);
        System.out.println("====================================");

        // 회원 정보 확인
        assertThat(member.getMemNickname())
                .isEqualTo("수정");

        // 권한 확인
        assertThat(member.getMemRole())
                .isEqualTo("MEMBER");

        // 이메일 확인
        assertThat(memberPrivate.getMemEmail())
                .isEqualTo("su11@naver.com");

        // 비밀번호가 암호화됐는지 확인
        assertThat(memberPrivate.getMemPassword())
                .isNotEqualTo("sujung1234");

        // 입력한 비밀번호와 암호화된 비밀번호 비교
        assertThat(passwordMatches)
                .isTrue();
    }
}