package com.spring.classon.member.mapper;

import com.spring.classon.member.dto.*;
import com.spring.classon.member.entity.*;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MemberMapper {

    // 회원 정보 조회 DTO 변환
    public MemberResponseDto toResponseDto(
            Member member,
            MemberPrivate memberPrivate) {

        return MemberResponseDto.builder()
                .memNo(member.getMemNo())
                .memEmail(memberPrivate.getMemEmail())
                .memNickname(member.getMemNickname())
                .memPhone(memberPrivate.getMemPhone())
                .memAddress(memberPrivate.getMemAddress())
                .memImg(member.getMemImg())
                .memRole(member.getMemRole())
                .memCreatedAt(member.getMemCreatedAt())
                .build();
    }

    // 회원 기본 정보 Entity 변환
    public Member toEntity(SignupRequestDto dto) {

        return Member.builder()
                .memNickname(dto.getMemNickname())
                .memCreatedAt(LocalDateTime.now())
                .memRole("USER")
                .build();
    }

    // 회원 개인정보 Entity 변환
    public MemberPrivate toPrivateEntity(
            SignupRequestDto dto,
            Member member,
            String encodedPassword
    ) {

        return MemberPrivate.builder()
                .member(member)
                .memEmail(dto.getMemEmail())
                .memPassword(encodedPassword)
                .memPhone(dto.getMemPhone())
                .memAddress(dto.getMemAddress())
                .memPwUpdate(LocalDateTime.now())
                .build();
    }
}