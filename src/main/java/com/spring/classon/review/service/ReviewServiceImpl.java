package com.spring.classon.review.service;

import com.spring.classon.review.dto.ReviewDTO;
import com.spring.classon.review.entity.Review;
import com.spring.classon.review.mapper.ReviewMapper;
import com.spring.classon.review.repository.ReviewRepository;
import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.entity.ReservationStatus;
import com.spring.classon.reservation.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    private final ReservationRepository reservationRepository;

    @Override
    public Long register(ReviewDTO reviewDTO) {

        Reservation reservation = reservationRepository
                .findById(reviewDTO.getRsvNo())
                .orElseThrow();

        if (reservation.getRsvStatus() != ReservationStatus.COMPLETED) {
            throw new IllegalStateException("수강 완료된 예약만 후기를 작성할 수 있습니다.");
        }

        boolean exists = reviewRepository.existsByRsvNo(
                reviewDTO.getRsvNo()
        );

        if(exists) {
            throw new IllegalStateException("이미 등록된 후기입니다.");
        }

        Review review = reviewMapper.toEntity(reviewDTO);
        Review savedReview = reviewRepository.save(review);

        return savedReview.getRevNo();

    }

    @Override
    public List<ReviewDTO> getClassList(Long clsNo){
        List<Review> reviews = reviewRepository.findByClsNo(clsNo);
        List<ReviewDTO> reviewDTOList = reviewMapper.toDTOList(reviews);

        return reviewDTOList;
    }

    @Override
    public List<ReviewDTO> getMemberList(Long memNo){
        List<Review> reviews = reviewRepository.findByMemNo(memNo);
        List<ReviewDTO> reviewDTOList = reviewMapper.toDTOList(reviews);

        return reviewDTOList;
    }

    @Override
    public void remove(Long revNo){
        reviewRepository.deleteById(revNo);
    }

    @Override
    public void blind(Long revNo){
        Optional<Review> result = reviewRepository.findById(revNo);
        Review review = result.orElseThrow();

        review.setRevStatus("Y");
    }

}
