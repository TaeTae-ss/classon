package com.spring.classon.member.controller;

import com.spring.classon.member.dto.*;
import com.spring.classon.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // 회원 정보 조회
    @GetMapping("/{memNo}")
    public ResponseEntity<MemberResponseDto> getMember(
            @PathVariable Long memNo) {

        return ResponseEntity.ok(memberService.getMember(memNo));
    }

    // 회원 정보 수정
    @PatchMapping("/{memNo}")
    public ResponseEntity<Void> updateMember(
            @PathVariable Long memNo,
            @RequestBody MemberUpdateDto dto) {

        memberService.updateMember(memNo, dto);

        return ResponseEntity.ok().build();
    }

    // 비밀번호 변경
    @PatchMapping("/{memNo}/password")
    public ResponseEntity<Void> updatePassword(
            @PathVariable Long memNo,
            @RequestBody MemberPasswordUpdateDto dto) {

        memberService.updatePassword(memNo, dto);

        return ResponseEntity.ok().build();
    }

    // 회원 탈퇴
    @DeleteMapping("/{memNo}")
    public ResponseEntity<Void> deleteMember(
            @PathVariable Long memNo) {

        memberService.deleteMember(memNo);

        return ResponseEntity.noContent().build();
    }
}