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

    @PostMapping
    public Long register(@RequestBody ReviewDTO reviewDTO){
        Long revNo = reviewService.register(reviewDTO);

        return revNo;
    }

    @GetMapping("/class/{clsNo}")
    public List<ReviewDTO> getClassList(@PathVariable Long clsNo) {

        List<ReviewDTO> reviewDTOList = reviewService.getClassList(clsNo);

        return reviewDTOList;
    }

    @GetMapping("/member/{memNo}")
    public List<ReviewDTO> getMemberList(@PathVariable Long memNo){

        List<ReviewDTO> reviewDTOList = reviewService.getMemberList(memNo);

        return reviewDTOList;
    }

}
