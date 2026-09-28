package com.spring.classon.review.service;

import com.spring.classon.review.dto.ReviewDTO;
import com.spring.classon.review.entity.Review;
import com.spring.classon.review.mapper.ReviewMapper;
import com.spring.classon.review.repository.ReviewRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @Override
    public Long register(ReviewDTO reviewDTO) {
        Review review = reviewMapper.toEntity(reviewDTO);
        Review savedReview = reviewRepository.save(review);

        return savedReview.getRevNo();

    }

    @Override
    public List<ReviewDTO> getList(Long clsNo){
        List<Review> reviews = reviewRepository.findByClsNo(clsNo);
        List<ReviewDTO> reviewDTOList = reviewMapper.toDTOList(reviews);

        return reviewDTOList;
    }

}
