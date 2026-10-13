package com.spring.classon.member.service;

import com.spring.classon.common.dto.PageRequestDTO;
import com.spring.classon.common.dto.PageResponseDTO;
import com.spring.classon.common.exception.*;
import com.spring.classon.instructor.entity.InstructorDocument;
import com.spring.classon.instructor.entity.InstructorRequest;
import com.spring.classon.instructor.repository.*;
import com.spring.classon.member.dto.*;
import com.spring.classon.member.entity.*;
import com.spring.classon.member.mapper.MemberMapper;
import com.spring.classon.member.repository.*;
import com.spring.classon.favorite.repository.FavoriteRepository;
import com.spring.classon.oneday.entity.OneDay;
import com.spring.classon.oneday.entity.Schedule;
import com.spring.classon.oneday.repository.*;
import com.spring.classon.payment.entity.*;
import com.spring.classon.payment.repository.PaymentRepository;
import com.spring.classon.reservation.entity.*;
import com.spring.classon.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.*;
import java.time.*;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final MemberPrivateRepository memberPrivateRepository;
    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;

    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final FavoriteRepository favoriteRepository;
    private final OneDayRepository oneDayRepository;
    private final ScheduleRepository scheduleRepository;

    private final InstructorRequestRepository instructorRequestRepository;
    private final InstructorDocumentRepository instructorDocumentRepository;
    private final InstructorRejectionRepository instructorRejectionRepository;

    // 회원 정보 조회
    @Override
    public MemberResponseDTO getMember(Long memNo) {

        Member member = memberRepository.findById(memNo)
                .orElseThrow(() ->
                        new MemberException("존재하지 않는 회원입니다."));

        MemberPrivate memberPrivate = memberPrivateRepository.findById(memNo)
                .orElseThrow(() ->
                        new MemberException("회원의 개인정보가 존재하지 않습니다."));

        return memberMapper.toResponseDto(member, memberPrivate);
    }

    // 회원 정보 수정
    @Override
    public void updateMember(Long memNo, MemberUpdateDTO dto) {

        Member member = memberRepository.findById(memNo)
                .orElseThrow(() ->
                        new MemberException("존재하지 않는 회원입니다."));

        MemberPrivate memberPrivate = memberPrivateRepository.findById(memNo)
                .orElseThrow(() ->
                        new MemberException("회원의 개인정보가 존재하지 않습니다."));

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
                .orElseThrow(() ->
                        new MemberException("존재하지 않는 회원입니다."));

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
            extension = originalFileName.substring(extensionIndex)
                    .toLowerCase();
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

            // 프로필 이미지 경로 저장
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
                        new MemberException("회원의 개인정보가 존재하지 않습니다."));

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(
                dto.getCurrentPassword(),
                memberPrivate.getMemPassword())) {

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
        String encodedPassword =
                passwordEncoder.encode(dto.getNewPassword());

        // 비밀번호 및 변경일 갱신
        memberPrivate.updatePassword(
                encodedPassword,
                LocalDateTime.now()
        );
    }

    // 회원 탈퇴 가능 여부 조회
    @Override
    public WithdrawalCheckDTO checkWithdrawal(Long memNo) {

        Member member = memberRepository.findById(memNo)
                .orElseThrow(() ->
                        new MemberException("존재하지 않는 회원입니다."));

        // 강사 일정 확인
        if ("INSTRUCTOR".equals(member.getMemRole())) {

            List<OneDay> classes = oneDayRepository.findByMemNo(memNo);
            LocalDate today = LocalDate.now();

            for (OneDay oneDay : classes) {

                List<Schedule> schedules =
                        scheduleRepository.findByClsNo(oneDay.getClsNo());

                boolean hasUpcomingSchedule = schedules.stream()
                        .anyMatch(schedule ->
                                !schedule.getSchStartDate().isBefore(today));

                if (hasUpcomingSchedule) {
                    return new WithdrawalCheckDTO(
                            false,
                            "진행 중이거나 예정된 클래스가 있어 탈퇴할 수 없습니다."
                    );
                }
            }

            return new WithdrawalCheckDTO(
                    true,
                    "정말로 탈퇴하시겠습니까?"
            );
        }

        // 일반 회원 예약 확인
        List<Reservation> reservations =
                reservationRepository.findAllByMemNoOrderByRsvCreatedAtDesc(memNo);

        for (Reservation reservation : reservations) {

            ReservationStatus status = reservation.getRsvStatus();

            if (status == ReservationStatus.WAIT
                    || status == ReservationStatus.CONFIRMED) {

                return new WithdrawalCheckDTO(
                        false,
                        "진행 중이거나 예정된 예약이 있어 탈퇴할 수 없습니다."
                );
            }

            // 최근 결제 시도 확인
            Optional<Payment> payment =
                    paymentRepository.findTopByReservationOrderByPayCreatedAtDesc(
                            reservation
                    );

            if (payment.isPresent()
                    && payment.get().getPayStatus() == PaymentStatus.WAIT) {

                return new WithdrawalCheckDTO(
                        false,
                        "처리 중인 결제가 있어 탈퇴할 수 없습니다."
                );
            }
        }

        return new WithdrawalCheckDTO(
                true,
                "정말로 탈퇴하시겠습니까"
        );
    }

    // 회원 탈퇴
    @Override
    public void deleteMember(Long memNo, boolean agreedToTerms) {

        // 탈퇴 약관 동의 확인
        if (!agreedToTerms) {
            throw new MemberException("탈퇴 약관에 동의해야 합니다.");
        }

        // 탈퇴 가능 여부 확인
        WithdrawalCheckDTO check = checkWithdrawal(memNo);

        if (!check.isCanWithdraw()) {
            throw new MemberException(check.getMessage());
        }

        // 회원 정보 조회
        Member member = memberRepository.findById(memNo)
                .orElseThrow(() ->
                        new MemberException("존재하지 않는 회원입니다."));

        MemberPrivate memberPrivate =
                memberPrivateRepository.findById(memNo)
                        .orElseThrow(() ->
                                new MemberException(
                                        "회원의 개인정보가 존재하지 않습니다."
                                ));

        // 회원의 강사 신청 조회
        List<InstructorRequest> requests =
                instructorRequestRepository
                        .findByMemNoOrderByReqNoDesc(memNo);

        // 강사 신청 관련 데이터 삭제
        for (InstructorRequest request : requests) {
            Long reqNo = request.getReqNo();

            // 증빙자료 조회
            List<InstructorDocument> documents =
                    instructorDocumentRepository.findAllByReqNo(reqNo);

            // 실제 증빙자료 파일 삭제
            Path uploadPath = Paths.get(
                    System.getProperty("user.dir"),
                    "uploads",
                    "instructor"
            ).toAbsolutePath().normalize();

            for (InstructorDocument document : documents) {
                String docUrl = document.getDocUrl();

                if (docUrl == null || docUrl.isBlank()) {
                    continue;
                }

                // 웹 경로를 실제 업로드 경로로 변환
                String normalizedDocUrl = docUrl.replace("\\", "/");
                Path filePath;

                if (normalizedDocUrl.startsWith("/uploads/instructor/")) {
                    String fileName = Paths.get(normalizedDocUrl)
                            .getFileName()
                            .toString();

                    filePath = uploadPath.resolve(fileName).normalize();
                } else {
                    filePath = Paths.get(docUrl)
                            .toAbsolutePath()
                            .normalize();
                }

                // 강사 증빙자료 폴더 내부의 파일만 삭제
                if (!filePath.startsWith(uploadPath)) {
                    throw new FileException(
                            "증빙자료 파일 경로가 올바르지 않습니다."
                    );
                }

                try {
                    Files.deleteIfExists(filePath);
                } catch (IOException e) {
                    throw new FileException(
                            "강사 신청 증빙자료 삭제에 실패했습니다."
                    );
                }
            }


            // 증빙자료 DB 데이터 삭제
            instructorDocumentRepository.deleteAllByReqNo(reqNo);

            // 거절 사유 삭제
            instructorRejectionRepository.deleteByReqNo(reqNo);
        }

        // 강사 신청 내역 삭제
        instructorRequestRepository.deleteAll(requests);

        // 회원 예약 조회
        List<Reservation> reservations =
                reservationRepository
                        .findAllByMemNoOrderByRsvCreatedAtDesc(memNo);

        // 예약에 연결된 결제 삭제
        for (Reservation reservation : reservations) {

            List<Payment> payments =
                    paymentRepository
                            .findAllByReservationOrderByPayCreatedAtDesc(
                                    reservation
                            );

            paymentRepository.deleteAll(payments);
        }

        // 회원의 찜 삭제
        favoriteRepository.deleteAllByMemNo(memNo);

        // 회원 예약 삭제
        reservationRepository.deleteAll(reservations);

        // 회원 개인정보 삭제
        memberPrivateRepository.delete(memberPrivate);

        // 회원 계정 삭제
        memberRepository.delete(member);
    }

    // 회원 공개 정보 요약 조회
    @Override
    public MemberSummaryDTO getMemberSummary(Long memNo) {

        Member member = memberRepository.findById(memNo)
                .orElseThrow(() ->
                        new IllegalArgumentException("존재하지 않는 회원입니다."));

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

    // 회원 관리(관리자)
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<MemberResponseDTO> getAdminMembers(
            PageRequestDTO pageRequestDTO) {

        String searchType = pageRequestDTO.getSearchType();
        String keyword = pageRequestDTO.getKeyword();

        searchType = searchType == null ? "" : searchType.trim();
        keyword = keyword == null ? "" : keyword.trim();

        // 검색 조건 확인
        if (!searchType.isEmpty()
                && !searchType.equals("nickname")
                && !searchType.equals("email")) {
            throw new MemberException("잘못된 검색 조건입니다.");
        }

        int page = pageRequestDTO.getPage();
        int size = pageRequestDTO.getSize();

        // 페이지 요청 확인
        if (page < 1 || size < 1 || size > 100) {
            throw new MemberException("잘못된 페이지 요청입니다.");
        }

        List<Long> memNos;

        // 전체 회원 조회
        if (keyword.isEmpty()) {
            memNos = memberRepository.findAll()
                    .stream()
                    .map(Member::getMemNo)
                    .sorted(Comparator.reverseOrder())
                    .toList();

            // 닉네임 검색
        } else if (searchType.equals("nickname")) {
            memNos = memberRepository
                    .findByMemNicknameContainingIgnoreCase(keyword)
                    .stream()
                    .map(Member::getMemNo)
                    .sorted(Comparator.reverseOrder())
                    .toList();

            // 이메일 검색
        } else if (searchType.equals("email")) {
            memNos = memberPrivateRepository
                    .findByMemEmailContainingIgnoreCase(keyword)
                    .stream()
                    .map(MemberPrivate::getMemNo)
                    .sorted(Comparator.reverseOrder())
                    .toList();

            // 검색 조건이 없으면 닉네임과 이메일 모두 검색
        } else {
            List<Long> nicknameNos = memberRepository
                    .findByMemNicknameContainingIgnoreCase(keyword)
                    .stream()
                    .map(Member::getMemNo)
                    .toList();

            List<Long> emailNos = memberPrivateRepository
                    .findByMemEmailContainingIgnoreCase(keyword)
                    .stream()
                    .map(MemberPrivate::getMemNo)
                    .toList();

            memNos = Stream.concat(
                            nicknameNos.stream(),
                            emailNos.stream()
                    )
                    .distinct()
                    .sorted(Comparator.reverseOrder())
                    .toList();
        }

        // 페이지 범위 계산
        int start = (page - 1) * size;
        int end = Math.min(start + size, memNos.size());

        List<MemberResponseDTO> dtoList;

        if (start >= memNos.size()) {
            dtoList = List.of();
        } else {
            dtoList = memNos.subList(start, end)
                    .stream()
                    .map(memNo -> {
                        Member member = memberRepository.findById(memNo)
                                .orElseThrow(() ->
                                        new MemberException(
                                                "회원을 찾을 수 없습니다."
                                        ));

                        MemberPrivate memberPrivate =
                                memberPrivateRepository.findById(memNo)
                                        .orElseThrow(() ->
                                                new MemberException(
                                                        "회원 개인정보를 찾을 수 없습니다."
                                                ));

                        // Mapper로 Entity를 DTO로 변환
                        return memberMapper.toResponseDto(
                                member,
                                memberPrivate
                        );
                    })
                    .toList();
        }

        return new PageResponseDTO<>(
                dtoList,
                pageRequestDTO,
                memNos.size()
        );
    }
}