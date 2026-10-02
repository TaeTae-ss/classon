package com.spring.classon.member.controller;

import com.spring.classon.member.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member/mypage")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'INS')")
public class MyPageController {

    private final MyPageService myPageService;

    // 내 회원번호 조회
    @GetMapping("/my-no")
    public ResponseEntity<Long> getMyNo(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                myPageService.getMyNo(authentication)
        );
    }
}