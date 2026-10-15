package com.spring.classon.instructor.repository;

import com.spring.classon.instructor.entity.InstructorRequest;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface InstructorRequestRepository
        extends JpaRepository<InstructorRequest, Long> {

    // 전체 강사 신청 목록 조회
    List<InstructorRequest> findAllByOrderByReqNoDesc();

    // 페이지 단위 강사 신청 목록 조회
    Page<InstructorRequest> findAllByOrderByReqNoDesc(Pageable pageable);

    // 회원 번호로 강사 신청 조회
    List<InstructorRequest> findByMemNoOrderByReqNoDesc(Long memNo);

    // 승인된 강사 신청 중 가장 최근 신청 조회
    Optional<InstructorRequest> findFirstByMemNoAndReqStatusOrderByReqNoDesc(
            Long memNo,
            String reqStatus
    );
}