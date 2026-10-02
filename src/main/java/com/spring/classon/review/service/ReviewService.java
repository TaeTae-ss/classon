package com.spring.classon.review.service;

import com.spring.classon.review.dto.ReviewDTO;

import java.util.List;

public interface ReviewService {
    //후기 등록
    Long register(ReviewDTO reviewDTO);

    //클래스별 후기
    List<ReviewDTO> getClassList(Long clsNo, String sort);

    //후기 삭제
    void remove(Long revNo, Long memNo);

    //후기 블라인드 처리
    void blind(Long revNo);

    //평균 평점
    Double getAverageRating(Long clsNo);


}
