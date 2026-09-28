package com.spring.classon.review.service;

import com.spring.classon.review.dto.ReviewDTO;

import java.util.List;

public interface ReviewService {
    Long register(ReviewDTO reviewDTO);
    List<ReviewDTO> getClassList(Long clsNo);   //클래스별 후기
    List<ReviewDTO> getMemberList(Long memNo);  //회원별 후기

}
