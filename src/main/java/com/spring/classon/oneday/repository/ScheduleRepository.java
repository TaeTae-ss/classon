package com.spring.classon.oneday.repository;

import com.spring.classon.oneday.entity.Schedule;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // 클래스별 일정 목록 조회
    List<Schedule> findByClsNo(Long clsNo);

    // 예약의 일정 조회 및 락
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Schedule s WHERE s.schNo = :schNo")
    Optional<Schedule> findByIdForUpdate(@Param("schNo") Long schNo);
}
