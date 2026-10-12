package com.spring.classon.inquiry.controller;

import com.spring.classon.inquiry.dto.InquiryDTO;
import com.spring.classon.inquiry.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.spring.classon.inquiry.dto.InquiryRegisterDTO;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inquiry")
public class InquiryController {

    private final InquiryService inquiryService;

    @PostMapping
    public ResponseEntity<Map<String, Long>> register(
            @Valid @RequestBody InquiryRegisterDTO inquiryDTO,
            Authentication authentication
    ) {
        Long memNo = getAuthenticatedMemberNo(authentication);

        // 클라이언트가 전달한 회원 번호 대신 JWT 회원 번호 사용
        inquiryDTO.setInqMemNo(memNo);

        Long inqNo = inquiryService.register(inquiryDTO);

        return ResponseEntity.ok(Map.of("inqNo", inqNo));
    }

    // 내 문의 목록
    // TODO: 로그인/JWT 구현 완료 후 로그인 회원 번호를 사용하도록 수정
    @GetMapping("/my")
    public ResponseEntity<List<InquiryDTO>> getMyList(
            @RequestParam Long inqMemNo) {

        return ResponseEntity.ok(
                inquiryService.getListByMember(inqMemNo)
        );
    }

    private Long getAuthenticatedMemberNo(Authentication authentication) {

        if (authentication == null
                || !(authentication.getPrincipal() instanceof Map<?, ?> claims)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }

        Object memNo = claims.get("memNo");

        if (!(memNo instanceof Number)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "회원 인증 정보가 올바르지 않습니다."
            );
        }

        return ((Number) memNo).longValue();
    }

    // 문의 상세 조회
    @GetMapping("/{repNo}")
    public ResponseEntity<InquiryDTO> getOne(
            @PathVariable Long repNo) {

        return ResponseEntity.ok(
                inquiryService.getOne(repNo)
        );
    }
}