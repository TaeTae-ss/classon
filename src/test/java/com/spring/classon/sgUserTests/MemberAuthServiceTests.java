package com.spring.classon.sgUserTests;

import com.spring.classon.member.dto.SignupRequestDTO;
import com.spring.classon.member.entity.*;
import com.spring.classon.member.repository.*;
import com.spring.classon.member.service.MemberAuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;
import com.spring.classon.member.mapper.MemberMapper;

import java.util.regex.Pattern;

import static org.assertj.core.api.Assertions.*;

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

    @Autowired
    private MemberMapper memberMapper;

    @Test
    void 회원가입_테스트() {

        // 회원가입 정보
        SignupRequestDTO requestDto = SignupRequestDTO.builder()
                .memNickname("수정")
                .memEmail("stellagirl1155@gmail.com")
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
                .isEqualTo("USER");

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

    @Test
    void 이메일_형식_검증_테스트() {

        SignupRequestDTO requestDto = SignupRequestDTO.builder()
                .memNickname("이메일테스트")
                .memEmail("sujung11naver.com")
                .memPassword("sujung1234")
                .memPhone("010-8115-3251")
                .memAddress("수원시")
                .build();

        try {

            memberAuthService.signup(requestDto);

        } catch (IllegalArgumentException e) {

            // 이메일 형식 오류 확인
            System.out.println("========== 이메일 형식 검증 ==========");
            System.out.println("입력한 이메일 : " + requestDto.getMemEmail());
            System.out.println("오류 메시지 : " + e.getMessage());
            System.out.println("====================================");

            assertThat(e.getMessage())
                    .isEqualTo("올바른 이메일 형식으로 입력해 주세요.");

            return;
        }

        throw new AssertionError("이메일 형식 오류가 발생하지 않았습니다.");
    }

    @Test
    void 이메일_중복확인_테스트() {

        // 이메일 중복 확인을 위한 회원가입 정보
        SignupRequestDTO requestDto = SignupRequestDTO.builder()
                .memNickname("수정")
                .memEmail("su11@naver.com")
                .memPassword("sujung1234")
                .memPhone("010-8115-3251")
                .memAddress("수원시")
                .build();

        memberAuthService.signup(requestDto);

        // 이메일 중복 확인
        boolean available =
                memberAuthService.checkEmail("su11@naver.com");

        // 결과 출력
        System.out.println("========== 이메일 중복확인 ==========");
        System.out.println("이메일 : su11@naver.com");
        System.out.println("사용 가능 여부 : " + available);
        System.out.println("====================================");

        // 이미 가입된 이메일이므로 사용 불가능
        assertThat(available).isFalse();
    }

    @Test
    void 닉네임_중복확인_테스트() {

        // 닉네임 중복 확인을 위한 회원가입 정보
        SignupRequestDTO requestDto = SignupRequestDTO.builder()
                .memNickname("수정")
                .memEmail("su11@naver.com")
                .memPassword("sujung1234")
                .memPhone("010-8115-3251")
                .memAddress("수원시")
                .build();

        memberAuthService.signup(requestDto);

        // 닉네임 중복 확인
        boolean available =
                memberAuthService.checkNickname("수정");

        // 결과 출력
        System.out.println("========== 닉네임 중복확인 ==========");
        System.out.println("닉네임 : 수정");
        System.out.println("사용 가능 여부 : " + available);
        System.out.println("====================================");

        // 이미 가입된 닉네임이므로 사용 불가능
        assertThat(available).isFalse();
    }

    @Test
    void 비밀번호_형식_검증_테스트() {

        SignupRequestDTO requestDto = SignupRequestDTO.builder()
                .memNickname("수정")
                .memEmail("su11@naver.com")
                .memPassword("12")
                .memPhone("010-8115-32511")
                .memAddress("수원시")
                .build();


        try {

            // 회원가입 실행
            memberAuthService.signup(requestDto);

        } catch (IllegalArgumentException e) {

            // 비밀번호 형식 오류 메시지 확인
            System.out.println("========== 비밀번호 형식 검증 ==========");
            System.out.println("입력한 비밀번호 : " + requestDto.getMemPassword());
            System.out.println("오류 메시지 : " + e.getMessage());
            System.out.println("======================================");

            assertThat(e.getMessage())
                    .isEqualTo("비밀번호는 영문과 숫자를 포함하여 8~20자로 입력해 주세요.");

            return;
        }

        // 예외가 발생하지 않으면 테스트 실패
        throw new AssertionError("비밀번호 형식 오류가 발생하지 않았습니다.");
    }



public void signup(SignupRequestDTO requestDto) {

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
    @Test
    @Commit
    void test() {

        // 회원가입 정보
        SignupRequestDTO requestDto = SignupRequestDTO.builder()
                .memNickname("수정")
                .memEmail("stellagirl1155@gmail.com")
                .memPassword("sujung1234")
                .memPhone("010-8115-3251")
                .memAddress("수원시")
                .build();

        // 회원가입
        signup(requestDto);

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
                "1234",
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

    }



}