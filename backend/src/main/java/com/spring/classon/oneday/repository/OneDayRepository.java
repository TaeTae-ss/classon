package com.spring.classon.oneday.repository;

import com.spring.classon.oneday.entity.OneDay;
import com.spring.classon.oneday.status.OneDayStatus;
import com.spring.classon.reservation.dto.ClassSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

import java.util.List;

public interface OneDayRepository extends JpaRepository<OneDay, Long> {

    // 카테고리별 상품 목록 조회 (모집중인 클래스)
    Page<OneDay> findByCatNoAndClsStatus(Long catNo, OneDayStatus clsStatus, Pageable pageable);

    // 전체 상품 목록 조회 (모집중인 클래스, 카테고리 필터 없음)
    Page<OneDay> findByClsStatus(OneDayStatus clsStatus, Pageable pageable);

    // 클래스 요약 조회
    @Query("""
    SELECT new com.spring.classon.reservation.dto.ClassSummaryDTO(
        c.clsNo,
        c.clsName,
        m.memNickname,
        c.clsImgThumb
    )
    FROM OneDay c
    JOIN Member m ON m.memNo = c.memNo
    WHERE c.clsNo = :clsNo
""")
    Optional<ClassSummaryDTO> findClassSummaryByClsNo(
            @Param("clsNo") Long clsNo
    );
    // 강사 본인 클래스 목록 조회
    List<OneDay> findByMemNo(Long memNo);
}
