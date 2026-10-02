package com.spring.classon.notice.controller;

import com.spring.classon.notice.dto.NoticeDTO;
import com.spring.classon.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/notices")
public class AdminNoticeController {

    private final NoticeService noticeService;

    // 44. 관리자 공지사항 등록
    @PostMapping
    public ResponseEntity<Map<String, Long>> register(
            @RequestBody NoticeDTO noticeDTO) {

        Long notNo = noticeService.register(noticeDTO);

        return ResponseEntity.ok(
                Map.of("notNo", notNo)
        );
    }

    // 45. 관리자 공지사항 수정
    @PutMapping("/{notNo}")
    public ResponseEntity<Map<String, String>> modify(
            @PathVariable Long notNo,
            @RequestBody NoticeDTO noticeDTO) {

        noticeService.modify(notNo, noticeDTO);

        return ResponseEntity.ok(
                Map.of("result", "success")
        );
    }

    // 46. 관리자 공지사항 삭제
    @DeleteMapping("/{notNo}")
    public ResponseEntity<Map<String, String>> remove(
            @PathVariable Long notNo) {

        noticeService.remove(notNo);

        return ResponseEntity.ok(
                Map.of("result", "success")
        );
    }
}