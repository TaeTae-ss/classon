package com.spring.classon.member.controller;

import com.spring.classon.common.dto.*;
import com.spring.classon.member.dto.MemberResponseDTO;
import com.spring.classon.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminMemberController {

    private final MemberService memberService;

    // 관리자 회원 목록 조회 및 검색
    @GetMapping
    public ResponseEntity<PageResponseDTO<MemberResponseDTO>> getAdminMembers(
            @ModelAttribute PageRequestDTO pageRequestDTO
    ) {
        return ResponseEntity.ok(
                memberService.getAdminMembers(pageRequestDTO)
        );
    }

    // 관리자 회원 상세 조회
    @GetMapping("/{memNo}")
    public ResponseEntity<MemberResponseDTO> getAdminMember(
            @PathVariable Long memNo
    ) {
        return ResponseEntity.ok(
                memberService.getMember(memNo)
        );
    }
}