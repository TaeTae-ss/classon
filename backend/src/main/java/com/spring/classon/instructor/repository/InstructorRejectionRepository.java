
package com.spring.classon.instructor.repository;

import com.spring.classon.instructor.entity.InstructorRejection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InstructorRejectionRepository
        extends JpaRepository<InstructorRejection, Long> {

    // 신청 번호로 최신 거절 사유 조회
    Optional<InstructorRejection> findFirstByReqNoOrderByRejNoDesc(Long reqNo);

    // 신청 번호로 거절 사유 삭제
    void deleteByReqNo(Long reqNo);
}
