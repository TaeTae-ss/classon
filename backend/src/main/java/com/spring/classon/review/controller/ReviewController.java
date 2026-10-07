package com.spring.classon.review.controller;

import com.spring.classon.review.dto.ReviewDTO;
import com.spring.classon.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    final ReviewService reviewService;

    //등록
    @PostMapping
    public Long register(@Valid @RequestBody ReviewDTO reviewDTO){
        Long revNo = reviewService.register(reviewDTO);

        return revNo;
    }

    //클래스 상세보기 후기 조회
    @GetMapping("/class/{clsNo}")
    public List<ReviewDTO> getClassList(
            @PathVariable Long clsNo,
            @RequestParam(defaultValue = "latest") String sort ) {

        List<ReviewDTO> reviewDTOList = reviewService.getClassList(clsNo, sort);

        return reviewDTOList;
    }

    //로그인 회원이 작성한 후기 목록 조회
    @GetMapping("/member")
    public List<ReviewDTO> getMemberReviews(Authentication authentication) {

        // JWT에서 로그인 회원 정보 조회
        Map<String, Object> claims =
                (Map<String, Object>) authentication.getPrincipal();

        // 로그인 회원 번호 추출
        Long memNo = ((Number) claims.get("memNo")).longValue();

        return reviewService.getMemberReviews(memNo);
    }

    //평균 평점 조회
    @GetMapping("/class/{clsNo}/average")
    public Double getAverageRating(@PathVariable Long clsNo) {

        Double averageRating = reviewService.getAverageRating(clsNo);

        return averageRating;
    }

    @DeleteMapping("/{revNo}")
    public void remove(
            @PathVariable Long revNo,
            Authentication authentication
    ){
        // JWT에서 로그인 회원 정보 조회
        Map<String, Object> claims =
                (Map<String, Object>) authentication.getPrincipal();

        // 로그인 회원 번호 추출
        Long memNo = ((Number) claims.get("memNo")).longValue();

        reviewService.remove(revNo, memNo);
    }

    //블라인드
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{revNo}/blind")
    public void blind(@PathVariable Long revNo){
        reviewService.blind(revNo);
    }


}
