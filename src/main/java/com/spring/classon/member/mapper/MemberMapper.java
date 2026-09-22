package com.spring.classon.member.mapper;

import com.spring.classon.member.dto.MemberResponseDto;
import com.spring.classon.member.entity.*;
import org.springframework.stereotype.Component;

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
}