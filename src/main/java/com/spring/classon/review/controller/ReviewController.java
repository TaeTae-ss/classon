package com.spring.classon.review.controller;

import com.spring.classon.review.dto.ReviewDTO;
import com.spring.classon.review.service.ReviewService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    final ReviewService reviewService;

    //등록
    @PostMapping
    public Long register(@RequestBody ReviewDTO reviewDTO){
        Long revNo = reviewService.register(reviewDTO);

        return revNo;
    }

    //클래스 상세보기 후기 조회
    @GetMapping("/class/{clsNo}")
    public List<ReviewDTO> getClassList(@PathVariable Long clsNo) {

        List<ReviewDTO> reviewDTOList = reviewService.getClassList(clsNo);

        return reviewDTOList;
    }

    //회원별 후기 조회
    @GetMapping("/member/{memNo}")
    public List<ReviewDTO> getMemberList(@PathVariable Long memNo){

        List<ReviewDTO> reviewDTOList = reviewService.getMemberList(memNo);

        return reviewDTOList;
    }

    @DeleteMapping("/{revNo}")
    public void remove(@PathVariable Long revNo){
        reviewService.remove(revNo);
    }

    @PatchMapping("/{revNo}/blind")
    public void blind(@PathVariable Long revNo){
        reviewService.blind(revNo);
    }


}
