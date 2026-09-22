package com.spring.classon.member.service;

import com.spring.classon.member.dto.*;
import com.spring.classon.member.entity.*;
import com.spring.classon.member.mapper.MemberMapper;
import com.spring.classon.member.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final MemberPrivateRepository memberPrivateRepository;
    private final MemberMapper memberMapper;

    // 회원 정보 조회
    @Override
    public MemberResponseDto getMember(Long memNo) {

        Member member = memberRepository.findById(memNo)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        MemberPrivate memberPrivate = memberPrivateRepository.findById(memNo)
                .orElseThrow(() -> new IllegalArgumentException("회원 개인정보가 존재하지 않습니다."));

        return memberMapper.toResponseDto(member, memberPrivate);
    }

    // 회원 정보 수정
    @Override
    public void updateMember(Long memNo, MemberUpdateDto dto) {

        Member member = memberRepository.findById(memNo)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        MemberPrivate memberPrivate = memberPrivateRepository.findById(memNo)
                .orElseThrow(() -> new IllegalArgumentException("회원 개인정보가 존재하지 않습니다."));

        member.updateMember(
                dto.getMemNickname(),
                dto.getMemImg()
        );

        memberPrivate.updateMemberPrivate(
                dto.getMemPhone(),
                dto.getMemAddress()
        );
    }

    @Override
    public void updatePassword(Long memNo, MemberPasswordUpdateDto dto) {

        MemberPrivate memberPrivate = memberPrivateRepository.findById(memNo)
                .orElseThrow(() -> new IllegalArgumentException("회원 개인정보가 존재하지 않습니다."));

        memberPrivate.updatePassword(
                dto.getNewPassword(),
                LocalDateTime.now()
        );
    }

    // 회원 탈퇴
    @Override
    public void deleteMember(Long memNo) {

        Member member = memberRepository.findById(memNo)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        MemberPrivate memberPrivate = memberPrivateRepository.findById(memNo)
                .orElseThrow(() -> new IllegalArgumentException("회원 개인정보가 존재하지 않습니다."));

        memberPrivateRepository.delete(memberPrivate);
        memberRepository.delete(member);
    }
}