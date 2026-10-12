
package com.spring.classon.instructor.service;

import com.spring.classon.common.exception.FileException;
import com.spring.classon.common.exception.InstructorException;
import com.spring.classon.instructor.dto.*;
import com.spring.classon.instructor.entity.*;
import com.spring.classon.instructor.mapper.InstructorDocumentMapper;
import com.spring.classon.instructor.mapper.InstructorMapper;
import com.spring.classon.instructor.repository.*;
import com.spring.classon.member.entity.Member;
import com.spring.classon.member.entity.MemberPrivate;
import com.spring.classon.member.repository.MemberPrivateRepository;
import com.spring.classon.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

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
    private final MemberPrivateRepository memberPrivateRepository;

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

    // 전체 강사 신청 목록 조회(관리자)
    @Override
    @Transactional(readOnly = true)
    public List<InstructorResponseDTO> getInstructorRequestList() {
        return instructorRequestRepository.findAllByOrderByReqNoDesc()
                .stream()
                .map(request -> {
                    // 신청 회원 조회
                    Member member = memberRepository.findById(request.getMemNo())
                            .orElseThrow(() ->
                                    new InstructorException("신청한 회원을 찾을 수 없습니다.")
                            );

                    // 회원 이메일 조회
                    MemberPrivate memberPrivate = memberPrivateRepository.findById(request.getMemNo())
                            .orElseThrow(() ->
                                    new InstructorException("회원 이메일 정보를 찾을 수 없습니다.")
                            );

                    // 신청 정보와 회원 정보 조립
                    return InstructorResponseDTO.builder()
                            .reqNo(request.getReqNo())
                            .memNo(request.getMemNo())
                            .memNickname(member.getMemNickname())
                            .memEmail(memberPrivate.getMemEmail())
                            .reqIntroduction(request.getReqIntroduction())
                            .reqCareer(request.getReqCareer())
                            .reqStatus(request.getReqStatus())
                            .build();
                })
                .toList();
    }

    // 회원 번호로 강사 신청 조회
    @Override
    @Transactional(readOnly = true)
    public InstructorResponseDTO getInstructorRequestByMemNo(Long memNo) {
        return instructorRequestRepository
                .findByMemNoOrderByReqNoDesc(memNo)
                .stream()
                .findFirst()
                .map(request -> {
                    // 신청 정보 조회
                    InstructorResponseDTO response =
                            instructorMapper.toResponseDto(request);

                    // 반려 사유 조회
                    String rejReason = instructorRejectionRepository
                            .findByReqNo(request.getReqNo())
                            .map(InstructorRejection::getRejReason)
                            .orElse(null);

                    // 반려 사유를 포함한 응답 반환
                    return InstructorResponseDTO.builder()
                            .reqNo(response.getReqNo())
                            .memNo(response.getMemNo())
                            .reqIntroduction(response.getReqIntroduction())
                            .reqCareer(response.getReqCareer())
                            .reqStatus(response.getReqStatus())
                            .memNickname(response.getMemNickname())
                            .memEmail(response.getMemEmail())
                            .rejReason(rejReason)
                            .build();
                })
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

            // 파일명 중복 방지
            String originalFileName = file.getOriginalFilename();

            if (originalFileName == null || originalFileName.isBlank()) {
                throw new FileException("파일명이 올바르지 않습니다.");
            }

            String fileName = UUID.randomUUID() + "_" + originalFileName;

            Path filePath = uploadPath.resolve(fileName);

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

    // 강사 신청 증빙자료 목록 조회(관리자)
    @Override
    @Transactional(readOnly = true)
    public List<InstructorDocumentResponseDTO> getInstructorDocuments(
            Long reqNo
    ) {
        // 강사 신청 확인
        instructorRequestRepository.findById(reqNo)
                .orElseThrow(() ->
                        new InstructorException(
                                "존재하지 않는 강사 신청입니다."
                        )
                );

        // 증빙자료 목록 조회
        return instructorDocumentRepository
                .findAllByReqNo(reqNo)
                .stream()
                .map(instructorDocumentMapper::toResponseDto)
                .toList();
    }

    // 강사 신청 증빙자료 목록 조회(회원 본인)
    @Override
    @Transactional(readOnly = true)
    public List<InstructorDocumentResponseDTO> getMyInstructorDocuments(
            Long reqNo,
            Long memNo
    ) {
        // 강사 신청 확인
        InstructorRequest request = instructorRequestRepository.findById(reqNo)
                .orElseThrow(() ->
                        new InstructorException("존재하지 않는 강사 신청입니다.")
                );

        // 본인 신청인지 확인
        if (!request.getMemNo().equals(memNo)) {
            throw new InstructorException("본인의 신청 서류만 조회할 수 있습니다.");
        }

        // 증빙자료 목록 조회
        return instructorDocumentRepository.findAllByReqNo(reqNo)
                .stream()
                .map(instructorDocumentMapper::toResponseDto)
                .toList();
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

    // 반려된 강사 신청의 기존 증빙자료 삭제
    @Override
    public void deleteMyInstructorDocuments(Long reqNo, Long memNo) {
        // 신청 정보 조회
        InstructorRequest request = instructorRequestRepository.findById(reqNo)
                .orElseThrow(() ->
                        new InstructorException("존재하지 않는 강사 신청입니다."));

        // 본인 신청인지 확인
        if (!request.getMemNo().equals(memNo)) {
            throw new InstructorException("본인의 신청 서류만 수정할 수 있습니다.");
        }

        // 반려된 신청인지 확인
        if (!"REJECTED".equals(request.getReqStatus())) {
            throw new InstructorException("반려된 강사 신청만 수정할 수 있습니다.");
        }

        // 기존 증빙자료 조회
        List<InstructorDocument> documents =
                instructorDocumentRepository.findAllByReqNo(reqNo);

        // 실제 파일 삭제
        for (InstructorDocument document : documents) {
            try {
                Files.deleteIfExists(Paths.get(document.getDocUrl()));
            } catch (IOException e) {
                throw new FileException("기존 증빙자료 삭제에 실패했습니다.");
            }
        }

        // DB 증빙자료 삭제
        instructorDocumentRepository.deleteAllByReqNo(reqNo);
    }

    // 반려된 강사 신청 수정
    @Override
    public void updateInstructorApplication(
            Long reqNo,
            Long memNo,
            InstructorRequestDTO dto
    ) {
        // 신청 정보 조회
        InstructorRequest request =
                instructorRequestRepository.findById(reqNo)
                        .orElseThrow(() ->
                                new InstructorException(
                                        "존재하지 않는 강사 신청입니다."
                                )
                        );

        // 본인 신청인지 확인
        if (!request.getMemNo().equals(memNo)) {
            throw new InstructorException(
                    "본인의 강사 신청만 수정할 수 있습니다."
            );
        }

        // 반려된 신청인지 확인
        if (!"REJECTED".equals(request.getReqStatus())) {
            throw new InstructorException(
                    "반려된 강사 신청만 수정할 수 있습니다."
            );
        }

        // 필수 항목 확인
        if (dto.getReqIntroduction() == null
                || dto.getReqIntroduction().isBlank()) {
            throw new InstructorException(
                    "자기소개를 입력해 주세요."
            );
        }

        // 신청 내용 수정
        request.updateApplication(
                dto.getReqIntroduction().trim(),
                dto.getReqCareer() == null
                        ? null
                        : dto.getReqCareer().trim()
        );

        // 재검토 요청
        request.updateStatus("NEW");
    }
}
