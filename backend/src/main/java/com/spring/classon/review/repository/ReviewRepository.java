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

    //상품별 평균 평점 일괄 조회 (블라인드 제외)
    @Query("""
        SELECT review.clsNo, AVG(review.revRating)
        FROM Review review
        WHERE review.clsNo IN :clsNos
        AND review.revStatus = 'N'
        GROUP BY review.clsNo
        """)
    List<Object[]> findAvgRatingByClsNos(@Param("clsNos") List<Long> clsNos);
    // 해당 클래스에 등록된 후기의 평균 평점 계산
    @Query("""
    SELECT AVG(review.revRating)
    FROM Review review
    WHERE review.clsNo = :clsNo
    AND review.revStatus = 'N'
    """)
    Double findAverageRatingByClsNo(@Param("clsNo") Long clsNo);

    boolean existsByRsvNo(Long rsvNo);

    // 예약번호 목록으로 회원이 작성한 후기 조회 (최신순)
    List<Review> findByRsvNoInOrderByRevCreatedAtDesc(List<Long> rsvNos);

}
