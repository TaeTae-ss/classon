package com.spring.classon.notice.controller;

import com.spring.classon.common.dto.PageRequestDTO;
import com.spring.classon.common.dto.PageResponseDTO;
import com.spring.classon.notice.dto.NoticeDTO;
import com.spring.classon.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeService noticeService;

    // 42. 공지사항 목록 조회
    @GetMapping
    public ResponseEntity<PageResponseDTO<NoticeDTO>> getList(
            PageRequestDTO pageRequestDTO) {

        return ResponseEntity.ok(
                noticeService.getList(pageRequestDTO)
        );
    }

    // 43. 공지사항 상세 조회
    @GetMapping("/{notNo}")
    public ResponseEntity<NoticeDTO> getOne(
            @PathVariable Long notNo) {

        return ResponseEntity.ok(
                noticeService.getOne(notNo)
        );
    }
}