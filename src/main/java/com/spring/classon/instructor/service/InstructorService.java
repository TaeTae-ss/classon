package com.spring.classon.instructor.service;

import com.spring.classon.instructor.dto.*;

public interface InstructorService {

    // 강사 신청
    Long applyInstructor(Long memNo, InstructorRequestDto dto);

    // 강사 신청 상태 조회
    InstructorResponseDto getInstructorRequest(Long reqNo);

    // 강사 신청 증빙자료 등록
    InstructorDocumentResponseDto addDocument(
            Long reqNo,
            String docName,
            String docUrl
    );
}