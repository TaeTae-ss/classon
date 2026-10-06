package com.spring.classon.instructor.repository;

import com.spring.classon.instructor.entity.InstructorRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InstructorRequestRepository
        extends JpaRepository<InstructorRequest, Long> {

    // 회원 번호로 강사 신청 조회
    List<InstructorRequest> findByMemNoOrderByReqNoDesc(Long memNo);
}