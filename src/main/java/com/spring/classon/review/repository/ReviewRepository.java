package com.spring.classon.review.repository;

import com.spring.classon.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review,Long> {
    // 최신순
    List<Review> findByClsNoOrderByRevCreatedAtDesc(Long clsNo);

    // 평점 높은순
    List<Review> findByClsNoOrderByRevRatingDesc(Long clsNo);

    // 평점 낮은순
    List<Review> findByClsNoOrderByRevRatingAsc(Long clsNo);

    //회원별 후기 조회
    @Query("""
        SELECT review
        FROM Review review, Reservation reservation
        WHERE review.rsvNo = reservation.rsvNo
        AND reservation.memNo = :memNo
        ORDER BY review.revCreatedAt DESC
        """)
    List<Review> findByMemNo(@Param("memNo") Long memNo);

    // 해당 클래스에 등록된 후기의 평균 평점 계산
    @Query("""
    SELECT AVG(review.revRating)
    FROM Review review
    WHERE review.clsNo = :clsNo
    """)
    Double findAverageRatingByClsNo(@Param("clsNo") Long clsNo);

    boolean existsByRsvNo(Long rsvNo);



}
