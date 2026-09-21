package com.spring.classon.memberTests;

import com.spring.classon.member.dto.MemberResponseDto;
import com.spring.classon.member.dto.MemberUpdateDto;
import com.spring.classon.member.entity.*;
import com.spring.classon.member.repository.*;
import com.spring.classon.member.service.MemberService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class MemberServiceTests {

    @Autowired
    private MemberService memberService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MemberPrivateRepository memberPrivateRepository;

    @Test
    public void 회원정보_조회_테스트() {

        // 테스트할 회원 정보 생성
        Member member = Member.builder()
                .memNickname("Hong^^")
                .memCreatedAt(LocalDateTime.now())
                .memImg(null)
                .memRole("USER")
                .build();

        memberRepository.save(member);

        // 테스트할 회원 비밀 정보 생성
        MemberPrivate memberPrivate = MemberPrivate.builder()
                .member(member)
                .memEmail("hong@naver.com")
                .memPassword("1234")
                .memPhone("010-1546-8551")
                .memAddress("서울시 강남구")
                .memPwUpdate(LocalDateTime.now())
                .build();

        memberPrivateRepository.save(memberPrivate);

        // 회원정보 조회 기능 실행
        MemberResponseDto result =
                memberService.getMember(member.getMemNo());

        // 조회된 회원정보가 입력한 값과 같은지 확인
        assertThat(result).isNotNull();
        assertThat(result.getMemNo()).isEqualTo(member.getMemNo());
        assertThat(result.getMemEmail()).isEqualTo("hong@naver.com");
        assertThat(result.getMemNickname()).isEqualTo("Hong^^");
        assertThat(result.getMemPhone()).isEqualTo("010-1546-8551");
        assertThat(result.getMemAddress()).isEqualTo("서울시 강남구");
        assertThat(result.getMemRole()).isEqualTo("USER");
    }

    @Test
    public void 회원정보_수정_테스트() {

        // 테스트할 회원 정보 생성
        Member member = Member.builder()
                .memNickname("travel1")
                .memCreatedAt(LocalDateTime.now())
                .memImg(null)
                .memRole("USER")
                .build();

        memberRepository.save(member);

        // 테스트할 회원 비밀 정보 생성
        MemberPrivate memberPrivate = MemberPrivate.builder()
                .member(member)
                .memEmail("travelLover@naver.com")
                .memPassword("1234")
                .memPhone("010-1572-3621")
                .memAddress("서울시 종로구")
                .memPwUpdate(LocalDateTime.now())
                .build();

        memberPrivateRepository.save(memberPrivate);

        // 회원정보 수정에 사용할 데이터
        MemberUpdateDto updateDto = new MemberUpdateDto(
                "travelLover",
                "010-3333-4444",
                "서울시 서초구",
                "newProfile.jpg"
        );

        // 회원정보 수정 기능 실행
        memberService.updateMember(member.getMemNo(), updateDto);

        // 수정된 회원정보 다시 조회
        Member updatedMember = memberRepository.findById(member.getMemNo())
                .orElseThrow();

        MemberPrivate updatedMemberPrivate =
                memberPrivateRepository.findById(member.getMemNo())
                        .orElseThrow();

        // 회원 기본정보가 제대로 수정됐는지 확인
        assertThat(updatedMember.getMemNickname()).isEqualTo("travelLover");
        assertThat(updatedMember.getMemImg()).isEqualTo("newProfile.jpg");

        // 회원 개인정보가 제대로 수정됐는지 확인
        assertThat(updatedMemberPrivate.getMemPhone()).isEqualTo("010-3333-4444");
        assertThat(updatedMemberPrivate.getMemAddress()).isEqualTo("서울시 서초구");
    }
}