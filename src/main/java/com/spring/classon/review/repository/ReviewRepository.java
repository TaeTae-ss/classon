package com.spring.classon.review.repository;

import com.spring.classon.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review,Long> {
    List<Review> findByClsNo(Long clsNo);

    //회원별 후기 조회
    @Query("""
        SELECT review
        FROM Review review, Reservation reservation
        WHERE review.rsvNo = reservation.rsvNo
        AND reservation.memNo = :memNo
        """)
    List<Review> findByMemNo(@Param("memNo") Long memNo);

}
