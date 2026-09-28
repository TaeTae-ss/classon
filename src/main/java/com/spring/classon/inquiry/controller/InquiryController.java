package com.spring.classon.inquiry.controller;

import com.spring.classon.common.dto.PageResponseDTO;
import com.spring.classon.inquiry.dto.InquiryDTO;
import com.spring.classon.inquiry.dto.InquiryPageRequestDTO;
import com.spring.classon.inquiry.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/inquiries")
public class InquiryController {

    private final InquiryService inquiryService;

    // 문의 등록
    @PostMapping
    public ResponseEntity<Map<String, Long>> register(
            @RequestBody InquiryDTO inquiryDTO) {

        Long inqNo = inquiryService.register(inquiryDTO);

        return ResponseEntity.ok(
                Map.of("inqNo", inqNo)
        );
    }

    // 특정 회원의 문의 목록
    @GetMapping("/member/{inqMemNo}")
    public ResponseEntity<List<InquiryDTO>> getListByMember(
            @PathVariable Long inqMemNo) {

        return ResponseEntity.ok(
                inquiryService.getListByMember(inqMemNo)
        );
    }

    // 문의 상세 조회
    @GetMapping("/{inqNo}")
    public ResponseEntity<InquiryDTO> getOne(
            @PathVariable Long inqNo) {

        return ResponseEntity.ok(
                inquiryService.getOne(inqNo)
        );
    }

    // 관리자 문의 목록 + 검색 + 상태 필터 + 페이징
    @GetMapping("/admin")
    public ResponseEntity<PageResponseDTO<InquiryDTO>> getList(
            InquiryPageRequestDTO pageRequestDTO) {

        return ResponseEntity.ok(
                inquiryService.getList(pageRequestDTO)
        );
    }

    // 관리자 답변 및 상태 변경
    @PutMapping("/admin/{inqNo}")
    public ResponseEntity<Map<String, String>> process(
            @PathVariable Long inqNo,
            @RequestBody InquiryDTO inquiryDTO) {

        inquiryService.process(inqNo, inquiryDTO);

        return ResponseEntity.ok(
                Map.of("result", "success")
        );
    }
}