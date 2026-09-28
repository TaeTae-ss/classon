package com.spring.classon.review.service;

import com.spring.classon.review.dto.ReviewDTO;

import java.util.List;

public interface ReviewService {
    Long register(ReviewDTO reviewDTO);
    List<ReviewDTO> getList(Long clsNo);

}
