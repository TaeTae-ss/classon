package com.spring.classon.instructor.service;

import com.spring.classon.common.exception.*;
import com.spring.classon.instructor.dto.*;
import com.spring.classon.instructor.entity.*;
import com.spring.classon.instructor.mapper.*;
import com.spring.classon.instructor.repository.*;
import com.spring.classon.member.entity.*;
import com.spring.classon.member.repository.*;
import com.spring.classon.common.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

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
    public Long applyInstructor(Long memNo, InstructorRequestDTO dto) {
        InstructorRequest request =
                instructorMapper.toEntity(memNo, dto, "NEW");

        InstructorRequest savedRequest =
                instructorRequestRepository.save(request);

        return savedRequest.getReqNo();
    }

    // 강사 신청 상태 조회
    @Override
    @Transactional(readOnly = true)
    public InstructorResponseDTO getInstructorRequest(Long reqNo) {
        InstructorRequest request =
                instructorRequestRepository.findById(reqNo)
                        .orElseThrow(() ->
                                new InstructorException(
                                        "존재하지 않는 강사 신청입니다."
                                )
                        );

        return instructorMapper.toResponseDto(request);
    }

    // 관리자 강사 신청 목록 페이지 조회
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<InstructorResponseDTO> getInstructorRequestList(
            PageRequestDTO pageRequestDTO) {

        // 페이지 요청값 검증
        if (pageRequestDTO.getPage() < 1
                || pageRequestDTO.getSize() < 1
                || pageRequestDTO.getSize() > 100) {
            throw new IllegalArgumentException("잘못된 페이지 요청입니다.");
        }

        // 페이지 단위로 강사 신청 조회
        Page<InstructorRequest> result =
                instructorRequestRepository.findAllByOrderByReqNoDesc(
                        pageRequestDTO.getPageable("reqNo")
                );

        // 응답 DTO 변환
        List<InstructorResponseDTO> dtoList = result.getContent()
                .stream()
                .map(request -> {
                    Member member = memberRepository.findById(request.getMemNo())
                            .orElse(null);

                    if (member == null) {
                        return null;
                    }

                    MemberPrivate memberPrivate =
                            memberPrivateRepository.findById(request.getMemNo())
                                    .orElse(null);

                    if (memberPrivate == null) {
                        return null;
                    }

                    String rejReason = instructorRejectionRepository
                            .findFirstByReqNoOrderByRejNoDesc(request.getReqNo())
                            .map(InstructorRejection::getRejReason)
                            .orElse(null);

                    return InstructorResponseDTO.builder()
                            .reqNo(request.getReqNo())
                            .memNo(request.getMemNo())
                            .memNickname(member.getMemNickname())
                            .memEmail(memberPrivate.getMemEmail())
                            .reqIntroduction(request.getReqIntroduction())
                            .reqCareer(request.getReqCareer())
                            .reqStatus(request.getReqStatus())
                            .rejReason(rejReason)
                            .build();
                })
                .filter(Objects::nonNull)
                .toList();

        return new PageResponseDTO<>(
                dtoList,
                pageRequestDTO,
                result.getTotalElements()
        );
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
                            .orElse(null);

                    // 탈퇴한 회원의 신청은 목록에서 제외
                    if (member == null) {
                        return null;
                    }

                    // 회원 이메일 조회
                    MemberPrivate memberPrivate =
                            memberPrivateRepository.findById(request.getMemNo())
                                    .orElse(null);

                    // 개인정보가 없는 회원의 신청도 목록에서 제외
                    if (memberPrivate == null) {
                        return null;
                    }

                    // 최신 반려 사유 조회
                    String rejReason = instructorRejectionRepository
                            .findFirstByReqNoOrderByRejNoDesc(request.getReqNo())
                            .map(InstructorRejection::getRejReason)
                            .orElse(null);

                    // 신청 정보와 회원 정보 조립
                    return InstructorResponseDTO.builder()
                            .reqNo(request.getReqNo())
                            .memNo(request.getMemNo())
                            .memNickname(member.getMemNickname())
                            .memEmail(memberPrivate.getMemEmail())
                            .reqIntroduction(request.getReqIntroduction())
                            .reqCareer(request.getReqCareer())
                            .reqStatus(request.getReqStatus())
                            .rejReason(rejReason)
                            .build();
                })
                .filter(Objects::nonNull)
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

                    // 최신 반려 사유 조회
                    String rejReason = instructorRejectionRepository
                            .findFirstByReqNoOrderByRejNoDesc(request.getReqNo())
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

    // 업로드 디렉터리
    private Path getInstructorUploadPath() {
        return Paths.get(
                System.getProperty("user.dir"),
                "uploads",
                "instructor"
        ).toAbsolutePath().normalize();
    }

    // 웹에서 접근할 수 있는 파일 경로 생성
    private String getDocumentWebUrl(String storedPath) {
        String normalizedPath = storedPath.replace("\\", "/");
        String fileName = normalizedPath.substring(
                normalizedPath.lastIndexOf("/") + 1
        );

        return "/uploads/instructor/" + fileName;
    }

    // 실제 파일 경로 조회
    private Path getDocumentFilePath(String storedPath) {
        String normalizedPath = storedPath.replace("\\", "/");

        // 기존 DB에 절대 경로가 저장된 경우
        Path storedFilePath = Paths.get(storedPath);

        if (storedFilePath.isAbsolute()) {
            return storedFilePath.normalize();
        }

        // 웹 경로 또는 상대 경로로 저장된 경우
        String fileName = normalizedPath.substring(
                normalizedPath.lastIndexOf("/") + 1
        );

        return getInstructorUploadPath().resolve(fileName).normalize();
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
                        new InstructorException("존재하지 않는 강사 신청입니다.")
                );

        if (file == null || file.isEmpty()) {
            throw new FileException("업로드할 파일을 선택해 주세요.");
        }

        try {
            Path uploadPath = getInstructorUploadPath();

            Files.createDirectories(uploadPath);

            // 파일명 중복 방지
            String originalFileName = file.getOriginalFilename();

            if (originalFileName == null || originalFileName.isBlank()) {
                throw new FileException("파일명이 올바르지 않습니다.");
            }

            // 경로 문자가 포함된 파일명 방지
            originalFileName = Paths.get(originalFileName)
                    .getFileName()
                    .toString();

            String fileName = UUID.randomUUID() + "_" + originalFileName;
            Path filePath = uploadPath.resolve(fileName).normalize();

            // 업로드 폴더 바깥으로 저장되지 않도록 확인
            if (!filePath.startsWith(uploadPath)) {
                throw new FileException("올바르지 않은 파일 경로입니다.");
            }

            file.transferTo(filePath);

            // DB에는 실제 디스크 경로 대신 웹 경로 저장
            String documentUrl = "/uploads/instructor/" + fileName;

            InstructorDocument document =
                    instructorDocumentMapper.toEntity(
                            reqNo,
                            fileName,
                            documentUrl
                    );

            InstructorDocument savedDocument =
                    instructorDocumentRepository.save(document);

            return instructorDocumentMapper.toResponseDto(savedDocument);

        } catch (IOException e) {
            throw new FileException("파일 저장에 실패했습니다.");
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
                        new InstructorException("존재하지 않는 강사 신청입니다.")
                );

        // 기존 절대 경로와 신규 웹 경로 모두 웹 URL로 변환
        return instructorDocumentRepository.findAllByReqNo(reqNo)
                .stream()
                .map(document -> {
                    InstructorDocumentResponseDTO response =
                            instructorDocumentMapper.toResponseDto(document);

                    return InstructorDocumentResponseDTO.builder()
                            .docNo(response.getDocNo())
                            .reqNo(response.getReqNo())
                            .docName(response.getDocName())
                            .docUrl(getDocumentWebUrl(document.getDocUrl()))
                            .build();
                })
                .toList();
    }

    // 강사 신청 증빙자료 파일 조회(관리자)
    @Override
    @Transactional(readOnly = true)
    public Resource getInstructorDocument(Long reqNo, Long docNo) {
        // 강사 신청 확인
        instructorRequestRepository.findById(reqNo)
                .orElseThrow(() ->
                        new InstructorException("존재하지 않는 강사 신청입니다.")
                );

        // 증빙자료 확인
        InstructorDocument document =
                instructorDocumentRepository.findAllByReqNo(reqNo)
                        .stream()
                        .filter(item -> item.getDocNo().equals(docNo))
                        .findFirst()
                        .orElseThrow(() ->
                                new FileException("존재하지 않는 증빙자료입니다.")
                        );

        // 실제 파일 경로 확인
        Path filePath = getDocumentFilePath(document.getDocUrl());
        Resource resource = new FileSystemResource(filePath);

        if (!resource.exists() || !resource.isReadable()) {
            throw new FileException("증빙자료 파일을 찾을 수 없습니다.");
        }

        return resource;
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
                .map(document -> {
                    InstructorDocumentResponseDTO response =
                            instructorDocumentMapper.toResponseDto(document);

                    return InstructorDocumentResponseDTO.builder()
                            .docNo(response.getDocNo())
                            .reqNo(response.getReqNo())
                            .docName(response.getDocName())
                            .docUrl(getDocumentWebUrl(document.getDocUrl()))
                            .build();
                })
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
                                new InstructorException("존재하지 않는 강사 신청입니다.")
                        );

        // 처리 가능한 상태인지 확인
        String reqStatus = dto.getReqStatus();

        if (!"APPROVED".equals(reqStatus)
                && !"REJECTED".equals(reqStatus)) {
            throw new InstructorException("올바르지 않은 승인 상태입니다.");
        }

        // 이미 처리된 신청인지 확인
        if (!"NEW".equals(request.getReqStatus())) {
            throw new InstructorException("이미 처리된 강사 신청입니다.");
        }

        // 반려 사유 확인
        if ("REJECTED".equals(reqStatus)) {
            String rejReason = dto.getRejReason();

            if (rejReason == null || rejReason.isBlank()) {
                throw new InstructorException("반려 사유를 입력해 주세요.");
            }

            if (rejReason.trim().length() > 100) {
                throw new InstructorException("반려 사유는 100자 이내로 입력해 주세요.");
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
            Member member = memberRepository.findById(request.getMemNo())
                    .orElseThrow(() ->
                            new InstructorException("신청한 회원을 찾을 수 없습니다.")
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
                        new InstructorException("존재하지 않는 강사 신청입니다.")
                );

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
                Path filePath = getDocumentFilePath(document.getDocUrl());
                Files.deleteIfExists(filePath);
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
        InstructorRequest request = instructorRequestRepository.findById(reqNo)
                .orElseThrow(() ->
                        new InstructorException("존재하지 않는 강사 신청입니다.")
                );

        // 본인 신청인지 확인
        if (!request.getMemNo().equals(memNo)) {
            throw new InstructorException("본인의 강사 신청만 수정할 수 있습니다.");
        }

        // 반려된 신청인지 확인
        if (!"REJECTED".equals(request.getReqStatus())) {
            throw new InstructorException("반려된 강사 신청만 수정할 수 있습니다.");
        }

        // 필수 항목 확인
        if (dto.getReqIntroduction() == null
                || dto.getReqIntroduction().isBlank()) {
            throw new InstructorException("자기소개를 입력해 주세요.");
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