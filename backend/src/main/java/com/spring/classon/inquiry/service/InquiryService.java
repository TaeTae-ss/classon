package com.spring.classon.inquiry.service;

import com.spring.classon.common.dto.PageResponseDTO;
import com.spring.classon.inquiry.dto.InquiryDTO;
import com.spring.classon.inquiry.dto.InquiryPageRequestDTO;
import com.spring.classon.inquiry.dto.InquiryRegisterDTO;

import java.util.List;

public interface InquiryService {

    // 문의 등록
    Long register(InquiryRegisterDTO inquiryDTO);

    // 특정 회원의 문의 목록
    List<InquiryDTO> getListByMember(Long inqMemNo);

    // 문의 상세 조회
    InquiryDTO getOne(Long inqNo);

    // 관리자 문의 목록 + 검색 + 상태 필터 + 페이징
    PageResponseDTO<InquiryDTO> getList(
            InquiryPageRequestDTO pageRequestDTO
    );

    // 관리자 문의 상태 변경
    void modifyStatus(Long inqNo, String inqStatus);

    // 관리자 문의 답변 등록/수정
    void modifyComment(Long inqNo, String admComment);
}