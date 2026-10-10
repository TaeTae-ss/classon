package com.spring.classon.member.service;

import com.spring.classon.common.exception.*;
import com.spring.classon.member.dto.*;
import com.spring.classon.member.entity.*;
import com.spring.classon.member.mapper.MemberMapper;
import com.spring.classon.member.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final MemberPrivateRepository memberPrivateRepository;
    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;

    // 회원 정보 조회
    @Override
    public MemberResponseDTO getMember(Long memNo) {

        Member member = memberRepository.findById(memNo)
                .orElseThrow(() -> new MemberException("존재하지 않는 회원입니다."));

        MemberPrivate memberPrivate = memberPrivateRepository.findById(memNo)
                .orElseThrow(() -> new MemberException("회원의 개인정보가 존재하지 않습니다."));

        return memberMapper.toResponseDto(member, memberPrivate);
    }

    // 회원 정보 수정
    @Override
    public void updateMember(Long memNo, MemberUpdateDTO dto) {

        Member member = memberRepository.findById(memNo)
                .orElseThrow(() -> new MemberException("존재하지 않는 회원입니다."));

        MemberPrivate memberPrivate = memberPrivateRepository.findById(memNo)
                .orElseThrow(() -> new MemberException("회원의 개인정보가 존재하지 않습니다."));

        member.updateMember(
                dto.getMemNickname(),
                dto.getMemImg()
        );

        memberPrivate.updateMemberPrivate(
                dto.getMemPhone(),
                dto.getMemAddress(),
                dto.getMemAddressDetail()
        );
    }

    // 프로필 이미지 수정
    @Override
    public void updateProfileImage(Long memNo, MultipartFile file) {

        Member member = memberRepository.findById(memNo)
                .orElseThrow(() -> new MemberException("존재하지 않는 회원입니다."));

        if (file == null || file.isEmpty()) {
            throw new FileException("프로필 이미지를 선택해주세요.");
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null || originalFileName.isBlank()) {
            throw new FileException("파일명이 존재하지 않습니다.");
        }

        String extension = "";

        int extensionIndex = originalFileName.lastIndexOf(".");

        if (extensionIndex > 0) {
            extension = originalFileName.substring(extensionIndex).toLowerCase();
        }

        if (!extension.matches("\\.(jpg|jpeg|png|webp)$")) {
            throw new FileException(
                    "jpg, jpeg, png, webp 파일만 업로드할 수 있습니다."
            );
        }

        try {
            Path uploadPath = Paths.get(
                    System.getProperty("user.dir"),
                    "uploads",
                    "member"
            );

            Files.createDirectories(uploadPath);

            String fileName =
                    memNo + "_" + UUID.randomUUID() + extension;

            Path filePath = uploadPath.resolve(fileName);

            file.transferTo(filePath.toFile());

            // DB에 웹에서 접근할 수 있는 경로로 저장(프로필 이미지)
            String imagePath = "/uploads/member/" + fileName;

            member.updateProfileImage(imagePath);

        } catch (IOException e) {
            throw new FileException("프로필 이미지 저장에 실패했습니다.");
        }
    }

    // 비밀번호 변경
    @Override
    public void updatePassword(Long memNo, MemberPasswordUpdateDTO dto) {
        MemberPrivate memberPrivate = memberPrivateRepository.findById(memNo)
                .orElseThrow(() ->
                        new MemberException("회원의 개인정보가 존재하지 않습니다.")
                );

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(
                dto.getCurrentPassword(),
                memberPrivate.getMemPassword()
        )) {
            throw new AuthException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 새 비밀번호 형식 확인
        String passwordRegex = "^(?=.*[A-Za-z])(?=.*\\d).{8,20}$";

        if (!Pattern.matches(passwordRegex, dto.getNewPassword())) {
            throw new IllegalArgumentException(
                    "비밀번호는 영문과 숫자를 포함하여 8~20자로 입력해 주세요."
            );
        }

        // 새 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getNewPassword());

        // 비밀번호 및 변경일 갱신
        memberPrivate.updatePassword(
                encodedPassword,
                LocalDateTime.now()
        );
    }

    // 회원 탈퇴
    @Override
    public void deleteMember(Long memNo) {

        Member member = memberRepository.findById(memNo)
                .orElseThrow(() -> new MemberException("존재하지 않는 회원입니다."));

        MemberPrivate memberPrivate = memberPrivateRepository.findById(memNo)
                .orElseThrow(() -> new MemberException("회원의 개인정보가 존재하지 않습니다."));

        memberPrivateRepository.delete(memberPrivate);
        memberRepository.delete(member);
    }

    // 회원 공개 정보 요약 조회
    @Override
    public MemberSummaryDTO getMemberSummary(Long memNo) {

        Member member = memberRepository.findById(memNo)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        return toSummaryDto(member);
    }

    // 회원 공개 정보 요약 일괄 조회
    @Override
    public List<MemberSummaryDTO> getMemberSummaries(List<Long> memNos) {

        return memberRepository.findAllById(memNos).stream()
                .map(this::toSummaryDto)
                .toList();
    }

    private MemberSummaryDTO toSummaryDto(Member member) {

        return MemberSummaryDTO.builder()
                .memNo(member.getMemNo())
                .memNickname(member.getMemNickname())
                .memRole(member.getMemRole())
                .build();
    }
}