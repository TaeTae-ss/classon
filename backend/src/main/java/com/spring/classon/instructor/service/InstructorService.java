package com.spring.classon.instructor.service;

import com.spring.classon.instructor.dto.*;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface InstructorService {

    // 강사 신청
    Long applyInstructor(
            Long memNo,
            InstructorRequestDTO dto
    );

    // 강사 신청 상태 조회
    InstructorResponseDTO getInstructorRequest(
            Long reqNo
    );

    // 회원 번호로 강사 신청 조회
    InstructorResponseDTO getInstructorRequestByMemNo(
            Long memNo
    );

    // 강사 신청 증빙자료 등록
    InstructorDocumentResponseDTO addDocument(
            Long reqNo,
            MultipartFile file
    );

    // 반려된 강사 신청의 기존 증빙자료 삭제
    void deleteMyInstructorDocuments(Long reqNo, Long memNo);

    // 전체 강사 신청 목록 조회(관리자)
    List<InstructorResponseDTO> getInstructorRequestList();

    // 강사 신청 증빙자료 목록 조회(관리자)
    List<InstructorDocumentResponseDTO> getInstructorDocuments(
            Long reqNo
    );

    // 강사 신청 증빙자료 파일 조회(관리자)
    Resource getInstructorDocument(Long reqNo, Long docNo);

    // 강사 신청 증빙자료 목록 조회(회원 본인)
    List<InstructorDocumentResponseDTO> getMyInstructorDocuments(
            Long reqNo, Long memNo
    );

    // 강사 신청 승인/거절
    void updateInstructorStatus(
            Long reqNo,
            InstructorApprovalDTO dto
    );

    // 반려된 강사 신청 수정
    void updateInstructorApplication(
            Long reqNo,
            Long memNo,
            InstructorRequestDTO dto
    );
}