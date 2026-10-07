package com.spring.classon.review.service;

import com.spring.classon.review.dto.ReviewDTO;

import java.util.List;
// 여기부터 추가
import java.util.Map;
// 여기까지 추가

public interface ReviewService {
    //후기 등록
    Long register(ReviewDTO reviewDTO);

    //클래스별 후기
    List<ReviewDTO> getClassList(Long clsNo, String sort);

    // 로그인 회원이 작성한 후기 조회
    List<ReviewDTO> getMemberReviews(Long memNo);

    // 관리자 전체 후기 조회
    List<ReviewDTO> getAdminReviews();

    //후기 삭제
    void remove(Long revNo, Long memNo);

    //후기 블라인드 처리
    void blind(Long revNo);

    //평균 평점
    Double getAverageRating(Long clsNo);

    // 여기부터 추가
    //상품별 평균 평점 일괄 조회
    Map<Long, Double> getAverageRatings(List<Long> clsNos);
    // 여기까지 추가
}
