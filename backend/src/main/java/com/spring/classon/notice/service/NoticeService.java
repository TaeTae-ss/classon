package com.spring.classon.notice.service;

import com.spring.classon.common.dto.PageRequestDTO;
import com.spring.classon.common.dto.PageResponseDTO;
import com.spring.classon.notice.dto.NoticeDTO;

public interface NoticeService {

    // 공지사항 등록
    Long register(NoticeDTO noticeDTO);

    // 공지사항 목록 조회 + 검색 + 페이징
    PageResponseDTO<NoticeDTO> getList(
            PageRequestDTO pageRequestDTO
    );

    // 공지사항 상세 조회
    NoticeDTO getOne(Long notNo);

    // 공지사항 수정
    void modify(Long notNo, NoticeDTO noticeDTO);

    // 공지사항 삭제
    void remove(Long notNo);
}