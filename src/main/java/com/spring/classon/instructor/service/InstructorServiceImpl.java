package com.spring.classon.instructor.service;

import com.spring.classon.instructor.dto.*;
import com.spring.classon.instructor.entity.*;
import com.spring.classon.instructor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@Transactional
public class InstructorServiceImpl implements InstructorService {

    private final InstructorRequestRepository instructorRequestRepository;
    private final InstructorDocumentRepository instructorDocumentRepository;
    private final InstructorRejectionRepository instructorRejectionRepository;

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
            MultipartFile file
    ) {

        // 강사 신청 확인
        instructorRequestRepository.findById(reqNo)
                .orElseThrow(() ->
                        new IllegalArgumentException("존재하지 않는 강사 신청입니다."));

        try {
            // 파일 저장 폴더
            Path uploadPath = Paths.get(
                    System.getProperty("user.dir"),
                    "uploads",
                    "instructor"
            );

            Files.createDirectories(uploadPath);

            // 업로드 파일 저장
            String fileName = file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            file.transferTo(filePath);

            // 증빙자료 정보 저장
            InstructorDocument document = InstructorDocument.builder()
                    .reqNo(reqNo)
                    .docName(fileName)
                    .docUrl(filePath.toString())
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

        } catch (IOException e) {
            throw new IllegalArgumentException("파일 저장에 실패했습니다.");
        }
    }

    // 강사 신청 승인/거절
    @Override
    public void updateInstructorStatus(Long reqNo, InstructorApprovalDto dto) {

        InstructorRequest request =
                instructorRequestRepository.findById(reqNo)
                        .orElseThrow(() ->
                                new IllegalArgumentException("존재하지 않는 강사 신청입니다."));

        request.updateStatus(dto.getReqStatus());

        if ("REJECTED".equals(dto.getReqStatus())) {

            InstructorRejection rejection = InstructorRejection.builder()
                    .reqNo(reqNo)
                    .rejReason(dto.getRejReason())
                    .build();

            instructorRejectionRepository.save(rejection);
        }
    }
}