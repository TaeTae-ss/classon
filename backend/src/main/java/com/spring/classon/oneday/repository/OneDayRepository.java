package com.spring.classon.oneday.repository;

import com.spring.classon.oneday.entity.OneDay;
import com.spring.classon.oneday.status.OneDayStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OneDayRepository extends JpaRepository<OneDay, Long> {

    // 카테고리별 상품 목록 조회 (모집중인 클래스)
    Page<OneDay> findByCatNoAndClsStatus(Long catNo, OneDayStatus clsStatus, Pageable pageable);

    // 전체 상품 목록 조회 (모집중인 클래스, 카테고리 필터 없음)
    Page<OneDay> findByClsStatus(OneDayStatus clsStatus, Pageable pageable);
}
