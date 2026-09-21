package com.spring.classon.member.service;

import com.spring.classon.member.dto.*;

public interface MemberService {

    // 회원 정보 조회
    MemberResponseDto getMember(Long memNo);

    // 회원 정보 수정
    void updateMember(Long memNo, MemberUpdateDto dto);

    // 회원 탈퇴
    void deleteMember(Long memNo);
}