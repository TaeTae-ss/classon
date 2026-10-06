package com.spring.classon.member.service;

import com.spring.classon.member.dto.*;

import java.util.List;

public interface MemberService {

    // 회원 정보 조회
    MemberResponseDTO getMember(Long memNo);

    // 회원 정보 수정
    void updateMember(Long memNo, MemberUpdateDTO dto);

    // 비밀번호 변경
    void updatePassword(Long memNo, MemberPasswordUpdateDTO dto);

    // 회원 탈퇴
    void deleteMember(Long memNo);

    // 여기부터 추가 (oneday 등 다른 도메인이 개인정보 없이 닉네임/role만 조회할 때 사용)
    // 회원 공개 정보 요약 조회
    MemberSummaryDTO getMemberSummary(Long memNo);

    // 회원 공개 정보 요약 일괄 조회
    List<MemberSummaryDTO> getMemberSummaries(List<Long> memNos);
    // 여기까지 추가
}