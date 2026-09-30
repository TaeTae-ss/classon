package com.spring.classon.review.service;

import com.spring.classon.review.dto.ReviewDTO;
import com.spring.classon.review.entity.Review;
import com.spring.classon.review.mapper.ReviewMapper;
import com.spring.classon.review.repository.ReviewRepository;
import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.entity.ReservationStatus;
import com.spring.classon.reservation.repository.ReservationRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

        //COMPLETED 확인
        if (reservation.getRsvStatus() != ReservationStatus.COMPLETED) {
            throw new IllegalStateException("수강 완료된 예약만 후기를 작성할 수 있습니다.");
        }

        // 후기 작성 가능 기간 확인
        LocalDateTime completedAt = reservation.getRsvCompletedAt();
        LocalDateTime reviewDeadline = completedAt.plusDays(7);

        if (LocalDateTime.now().isAfter(reviewDeadline)) {
            throw new IllegalStateException("후기 작성 기간이 지났습니다.");
        }

        //후기 중복 확인
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

    //클래스별 후기
    @Override
    public List<ReviewDTO> getClassList(Long clsNo, String sort){
        List<Review> reviews;

        switch (sort) {
            case "ratingDesc" :
                reviews = reviewRepository.findByClsNoOrderByRevRatingDesc(clsNo);
                break;

            case "ratingAsc" :
                reviews = reviewRepository.findByClsNoOrderByRevRatingAsc(clsNo);
                break;

            default :
                reviews = reviewRepository.findByClsNoOrderByRevCreatedAtDesc(clsNo);
                break;
        }

        List<ReviewDTO> reviewDTOList = reviewMapper.toDTOList(reviews);

        return reviewDTOList;
    }

    //회원별 후기
    @Override
    public List<ReviewDTO> getMemberList(Long memNo){
        List<Review> reviews = reviewRepository.findByMemNo(memNo);
        List<ReviewDTO> reviewDTOList = reviewMapper.toDTOList(reviews);

        return reviewDTOList;
    }

    @Override
    public void remove(Long revNo, Long memNo) {

        // 삭제할 후기 조회
        Review review = reviewRepository.findById(revNo)
                .orElseThrow(() ->
                        new EntityNotFoundException("후기를 찾을 수 없습니다.")
                );

        // 후기와 연결된 예약 조회
        Reservation reservation = reservationRepository
                .findById(review.getRsvNo())
                .orElseThrow(() ->
                        new EntityNotFoundException("예약 정보를 찾을 수 없습니다.")
                );

        // 로그인 회원이 작성한 후기인지 확인
        if (!reservation.getMemNo().equals(memNo)) {
            throw new IllegalStateException(
                    "본인이 작성한 후기만 삭제할 수 있습니다."
            );
        }

        // 본인의 후기인 경우 삭제
        reviewRepository.delete(review);
    }

    //블라인드 처리
    @Override
    public void blind(Long revNo){
        Optional<Review> result = reviewRepository.findById(revNo);
        Review review = result.orElseThrow();

        review.setRevStatus("Y");
    }

    //평균 평점
    @Override
    public Double getAverageRating(Long clsNo) {
        return reviewRepository.findAverageRatingByClsNo(clsNo);
    }

}
