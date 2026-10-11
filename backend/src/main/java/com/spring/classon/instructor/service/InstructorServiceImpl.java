package com.spring.classon.instructor.service;

import com.spring.classon.common.exception.FileException;
import com.spring.classon.common.exception.InstructorException;
import com.spring.classon.instructor.dto.*;
import com.spring.classon.instructor.entity.*;
import com.spring.classon.instructor.mapper.InstructorDocumentMapper;
import com.spring.classon.instructor.mapper.InstructorMapper;
import com.spring.classon.instructor.repository.*;
import com.spring.classon.member.entity.Member;
import com.spring.classon.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
@Transactional
public class InstructorServiceImpl implements InstructorService {

    private final InstructorRequestRepository instructorRequestRepository;
    private final InstructorDocumentRepository instructorDocumentRepository;
    private final InstructorRejectionRepository instructorRejectionRepository;
    private final InstructorMapper instructorMapper;
    private final InstructorDocumentMapper instructorDocumentMapper;
    private final MemberRepository memberRepository;

    // 강사 신청
    @Override
    public Long applyInstructor(
            Long memNo,
            InstructorRequestDTO dto
    ) {
        InstructorRequest request =
                instructorMapper.toEntity(
                        memNo,
                        dto,
                        "NEW"
                );

        InstructorRequest savedRequest =
                instructorRequestRepository.save(request);

        return savedRequest.getReqNo();
    }

    // 강사 신청 상태 조회
    @Override
    @Transactional(readOnly = true)
    public InstructorResponseDTO getInstructorRequest(
            Long reqNo
    ) {
        InstructorRequest request =
                instructorRequestRepository.findById(reqNo)
                        .orElseThrow(() ->
                                new InstructorException(
                                        "존재하지 않는 강사 신청입니다."
                                )
                        );

        return instructorMapper.toResponseDto(request);
    }

    // 회원 번호로 강사 신청 조회
    @Override
    @Transactional(readOnly = true)
    public InstructorResponseDTO getInstructorRequestByMemNo(
            Long memNo
    ) {
        return instructorRequestRepository
                .findByMemNoOrderByReqNoDesc(memNo)
                .stream()
                .findFirst()
                .map(instructorMapper::toResponseDto)
                .orElse(null);
    }

    // 강사 신청 증빙자료 등록
    @Override
    public InstructorDocumentResponseDTO addDocument(
            Long reqNo,
            MultipartFile file
    ) {
        // 강사 신청 확인
        instructorRequestRepository.findById(reqNo)
                .orElseThrow(() ->
                        new InstructorException(
                                "존재하지 않는 강사 신청입니다."
                        )
                );

        try {
            Path uploadPath = Paths.get(
                    System.getProperty("user.dir"),
                    "uploads",
                    "instructor"
            );

            Files.createDirectories(uploadPath);

            String fileName = file.getOriginalFilename();

            Path filePath =
                    uploadPath.resolve(fileName);

            file.transferTo(filePath);

            InstructorDocument document =
                    instructorDocumentMapper.toEntity(
                            reqNo,
                            fileName,
                            filePath.toString()
                    );

            InstructorDocument savedDocument =
                    instructorDocumentRepository.save(document);

            return instructorDocumentMapper.toResponseDto(
                    savedDocument
            );

        } catch (IOException e) {
            throw new FileException(
                    "파일 저장에 실패했습니다."
            );
        }
    }

    // 강사 신청 승인 및 반려
    @Override
    public void updateInstructorStatus(
            Long reqNo,
            InstructorApprovalDTO dto
    ) {
        // 신청 정보 조회
        InstructorRequest request =
                instructorRequestRepository.findById(reqNo)
                        .orElseThrow(() ->
                                new InstructorException(
                                        "존재하지 않는 강사 신청입니다."
                                )
                        );

        // 처리 가능한 상태인지 확인
        String reqStatus = dto.getReqStatus();

        if (!"APPROVED".equals(reqStatus)
                && !"REJECTED".equals(reqStatus)) {
            throw new InstructorException(
                    "올바르지 않은 승인 상태입니다."
            );
        }

        // 이미 처리된 신청인지 확인
        if (!"NEW".equals(request.getReqStatus())) {
            throw new InstructorException(
                    "이미 처리된 강사 신청입니다."
            );
        }

        // 반려 사유 확인
        if ("REJECTED".equals(reqStatus)) {
            String rejReason = dto.getRejReason();

            if (rejReason == null || rejReason.isBlank()) {
                throw new InstructorException(
                        "반려 사유를 입력해 주세요."
                );
            }

            if (rejReason.trim().length() > 100) {
                throw new InstructorException(
                        "반려 사유는 100자 이내로 입력해 주세요."
                );
            }

            // 반려 사유 저장
            InstructorRejection rejection =
                    InstructorRejection.builder()
                            .reqNo(reqNo)
                            .rejReason(rejReason.trim())
                            .build();

            instructorRejectionRepository.save(rejection);
        }

        // 승인 시 회원 권한 변경
        if ("APPROVED".equals(reqStatus)) {
            Member member = memberRepository.findById(
                    request.getMemNo()
            ).orElseThrow(() ->
                    new InstructorException(
                            "신청한 회원을 찾을 수 없습니다."
                    )
            );

            member.updateMemberRole("INSTRUCTOR");
        }

        // 신청 상태 변경
        request.updateStatus(reqStatus);
    }
}