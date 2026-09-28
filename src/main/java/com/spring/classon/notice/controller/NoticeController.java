package com.spring.classon.notice.controller;

import com.spring.classon.common.dto.PageRequestDTO;
import com.spring.classon.common.dto.PageResponseDTO;
import com.spring.classon.notice.dto.NoticeDTO;
import com.spring.classon.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notices")
public class NoticeController {

    private final NoticeService noticeService;

    // 공지사항 전체 조회
    @GetMapping
    public ResponseEntity<PageResponseDTO<NoticeDTO>> getList(
            PageRequestDTO pageRequestDTO
    ) {

        return ResponseEntity.ok(
                noticeService.getList(pageRequestDTO)
        );
    }

    // 공지사항 상세 조회
    @GetMapping("/{notNo}")
    public ResponseEntity<NoticeDTO> getOne(
            @PathVariable Long notNo) {

        return ResponseEntity.ok(noticeService.getOne(notNo));
    }

    // 공지사항 등록
    @PostMapping
    public ResponseEntity<Map<String, Long>> register(
            @RequestBody NoticeDTO noticeDTO) {

        Long notNo = noticeService.register(noticeDTO);

        return ResponseEntity.ok(
                Map.of("notNo", notNo)
        );
    }

    // 공지사항 수정
    @PutMapping("/{notNo}")
    public ResponseEntity<Map<String, String>> modify(
            @PathVariable Long notNo,
            @RequestBody NoticeDTO noticeDTO) {

        noticeService.modify(notNo, noticeDTO);

        return ResponseEntity.ok(
                Map.of("result", "success")
        );
    }

    // 공지사항 삭제
    @DeleteMapping("/{notNo}")
    public ResponseEntity<Map<String, String>> remove(
            @PathVariable Long notNo) {

        noticeService.remove(notNo);

        return ResponseEntity.ok(
                Map.of("result", "success")
        );
    }
}