package com.spring.classon.instructor.repository;

import com.spring.classon.instructor.entity.InstructorDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InstructorDocumentRepository
        extends JpaRepository<InstructorDocument, Long> {

    // 신청 번호로 증빙자료 조회
    List<InstructorDocument> findAllByReqNo(Long reqNo);

    // 신청 번호로 증빙자료 삭제
    void deleteAllByReqNo(Long reqNo);
}