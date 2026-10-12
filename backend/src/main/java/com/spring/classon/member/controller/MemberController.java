package com.spring.classon.member.controller;

import com.spring.classon.member.dto.*;
import com.spring.classon.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'INSTRUCTOR')")
public class MemberController {

    private final MemberService memberService;

    // 회원 정보 조회
    @GetMapping("/{memNo}")
    public ResponseEntity<MemberResponseDTO> getMember(
            @PathVariable Long memNo) {

        return ResponseEntity.ok(memberService.getMember(memNo));
    }

    // 회원 정보 수정
    @PatchMapping("/{memNo}")
    public ResponseEntity<Void> updateMember(
            @PathVariable Long memNo,
            @RequestBody MemberUpdateDTO dto) {

        memberService.updateMember(memNo, dto);

        return ResponseEntity.ok().build();
    }

    // 프로필 이미지 수정
    @PatchMapping("/{memNo}/image")
    public ResponseEntity<Void> updateProfileImage(
            @PathVariable Long memNo,
            @RequestParam("file") MultipartFile file) {

        memberService.updateProfileImage(
                memNo,
                file
        );

        return ResponseEntity.ok().build();
    }

    // 비밀번호 변경
    @PatchMapping("/{memNo}/password")
    public ResponseEntity<Void> updatePassword(
            @PathVariable Long memNo,
            @RequestBody MemberPasswordUpdateDTO dto) {

        memberService.updatePassword(memNo, dto);

        return ResponseEntity.ok().build();
    }

    // 회원 탈퇴 가능 여부 조회
    @GetMapping("/{memNo}/withdrawal-check")
    public ResponseEntity<WithdrawalCheckDTO> checkWithdrawal(
            @PathVariable Long memNo) {

        return ResponseEntity.ok(
                memberService.checkWithdrawal(memNo)
        );
    }

    // 회원 탈퇴
    @DeleteMapping("/{memNo}")
    public ResponseEntity<Void> deleteMember(
            @PathVariable Long memNo,
            @RequestBody WithdrawalRequestDTO dto) {

        memberService.deleteMember(memNo, dto.isAgreedToTerms());

        return ResponseEntity.noContent().build();
    }
}