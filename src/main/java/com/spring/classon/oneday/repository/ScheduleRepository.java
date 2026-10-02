package com.spring.classon.oneday.repository;

import com.spring.classon.oneday.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // 클래스별 일정 목록 조회
    List<Schedule> findByClsNo(Long clsNo);
}
