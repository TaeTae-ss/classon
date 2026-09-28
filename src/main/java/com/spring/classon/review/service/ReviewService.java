package com.spring.classon.review.service;

import com.spring.classon.review.dto.ReviewDTO;

import java.util.List;

public interface ReviewService {
    Long register(ReviewDTO reviewDTO);         //후기 등록
    List<ReviewDTO> getClassList(Long clsNo);   //클래스별 후기
    List<ReviewDTO> getMemberList(Long memNo);  //회원별 후기
    void remove(Long revNo);                    //후기 삭제
    void blind(Long revNo);                     //후기 블라인드 처리

}
