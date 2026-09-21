package com.spring.classon.instructor.service;

import com.spring.classon.instructor.dto.*;
import com.spring.classon.instructor.entity.*;
import com.spring.classon.instructor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class InstructorServiceImpl implements InstructorService {

    private final InstructorRequestRepository instructorRequestRepository;
    private final InstructorDocumentRepository instructorDocumentRepository;

    // 강사 신청
    @Override
    public Long applyInstructor(Long memNo, InstructorRequestDto dto) {

        InstructorRequest request = InstructorRequest.builder()
                .memNo(memNo)
                .reqIntroduction(dto.getReqIntroduction())
                .reqCareer(dto.getReqCareer())
                .reqStatus("NEW")
                .build();

        InstructorRequest savedRequest =
                instructorRequestRepository.save(request);

        return savedRequest.getReqNo();
    }

    // 강사 신청 상태 조회
    @Override
    @Transactional(readOnly = true)
    public InstructorResponseDto getInstructorRequest(Long reqNo) {

        InstructorRequest request =
                instructorRequestRepository.findById(reqNo)
                        .orElseThrow(() ->
                                new IllegalArgumentException("존재하지 않는 강사 신청입니다."));

        return InstructorResponseDto.builder()
                .reqNo(request.getReqNo())
                .memNo(request.getMemNo())
                .reqIntroduction(request.getReqIntroduction())
                .reqCareer(request.getReqCareer())
                .reqStatus(request.getReqStatus())
                .build();
    }

    // 강사 신청 증빙자료 등록
    @Override
    public InstructorDocumentResponseDto addDocument(
            Long reqNo,
            String docName,
            String docUrl
    ) {

        InstructorRequest request =
                instructorRequestRepository.findById(reqNo)
                        .orElseThrow(() ->
                                new IllegalArgumentException("존재하지 않는 강사 신청입니다."));

        InstructorDocument document = InstructorDocument.builder()
                .reqNo(request.getReqNo())
                .docName(docName)
                .docUrl(docUrl)
                .docCreatedAt(java.time.LocalDateTime.now())
                .build();

        InstructorDocument savedDocument =
                instructorDocumentRepository.save(document);

        return InstructorDocumentResponseDto.builder()
                .docNo(savedDocument.getDocNo())
                .reqNo(savedDocument.getReqNo())
                .docName(savedDocument.getDocName())
                .docUrl(savedDocument.getDocUrl())
                .build();
    }
}