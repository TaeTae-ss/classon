package com.spring.classon.member.controller;

import com.spring.classon.member.dto.MyPageResponseDTO;
import com.spring.classon.member.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/member/mypage")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'INSTRUCTOR')")
public class MyPageController {

    private final MyPageService myPageService;

    // 마이페이지 조회
    @GetMapping
    public ResponseEntity<MyPageResponseDTO> getMyPage(
            Authentication authentication) {

        Map<?, ?> claims = (Map<?, ?>) authentication.getPrincipal();
        Long memNo = ((Number) claims.get("memNo")).longValue();

        return ResponseEntity.ok(
                myPageService.getMyPage(memNo)
        );
    }
}