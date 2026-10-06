package com.spring.classon.inquiry.controller;

import com.spring.classon.common.dto.PageResponseDTO;
import com.spring.classon.inquiry.dto.InquiryCommentDTO;
import com.spring.classon.inquiry.dto.InquiryDTO;
import com.spring.classon.inquiry.dto.InquiryPageRequestDTO;
import com.spring.classon.inquiry.dto.InquiryStatusDTO;
import com.spring.classon.inquiry.service.InquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.spring.classon.inquiry.dto.InquiryStatusDTO;
import com.spring.classon.inquiry.dto.InquiryCommentDTO;
import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/inquiry")
public class AdminInquiryController {

    private final InquiryService inquiryService;

    // 관리자 문의 목록 조회 + 검색 + 상태 필터 + 페이징
    @GetMapping
    public ResponseEntity<PageResponseDTO<InquiryDTO>> getList(
            InquiryPageRequestDTO pageRequestDTO) {

        return ResponseEntity.ok(
                inquiryService.getList(pageRequestDTO)
        );
    }

    // 관리자 문의 상세 조회
    @GetMapping("/{repNo}")
    public ResponseEntity<InquiryDTO> getOne(
            @PathVariable Long repNo) {

        return ResponseEntity.ok(
                inquiryService.getOne(repNo)
        );
    }

    @PatchMapping("/{repNo}/status")
    public ResponseEntity<Map<String, String>> modifyStatus(
            @PathVariable Long repNo,
            @Valid @RequestBody InquiryStatusDTO statusDTO) {

        inquiryService.modifyStatus(
                repNo,
                statusDTO.getInqStatus()
        );

        return ResponseEntity.ok(
                Map.of("result", "success")
        );
    }

    @PatchMapping("/{repNo}/comment")
    public ResponseEntity<Map<String, String>> modifyComment(
            @PathVariable Long repNo,
            @Valid @RequestBody InquiryCommentDTO commentDTO) {

        inquiryService.modifyComment(
                repNo,
                commentDTO.getAdmComment()
        );

        return ResponseEntity.ok(
                Map.of("result", "success")
        );
    }
}