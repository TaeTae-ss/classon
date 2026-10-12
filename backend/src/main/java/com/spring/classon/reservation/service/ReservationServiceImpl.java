package com.spring.classon.reservation.service;

import com.spring.classon.common.exception.ReservationException;
import com.spring.classon.member.entity.Member;
import com.spring.classon.oneday.entity.OneDay;
import com.spring.classon.oneday.entity.Schedule;
import com.spring.classon.oneday.repository.OneDayRepository;
import com.spring.classon.oneday.repository.ScheduleRepository;
import com.spring.classon.payment.service.PaymentService;
import com.spring.classon.reservation.dto.ClassSummaryDTO;
import com.spring.classon.reservation.dto.ReservationCountDTO;
import com.spring.classon.reservation.dto.ReservationDTO;
import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.entity.ReservationStatus;
import com.spring.classon.reservation.mapper.ReservationMapper;
import com.spring.classon.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationServiceImpl implements ReservationService{
    private final ReservationRepository reservationRepository;
    private final ScheduleRepository scheduleRepository;
    private final OneDayRepository oneDayRepository;
    private final ReservationMapper reservationMapper;
    private final PaymentService paymentService;

    // 수업 일정 및 클래스 정보 포함 DTO 변환
    private ReservationDTO toReservationDTO(Reservation reservation) {

        // 기존 예약 정보 DTO 변환
        ReservationDTO dto = reservationMapper.toDTO(reservation);

        // 예약에 연결된 일정 조회
        Schedule schedule = scheduleRepository.findById(reservation.getSchNo())
                .orElseThrow(() -> new ReservationException(
                        "일정 정보를 찾을 수 없습니다."
                ));

        // 수업 시작일 설정
        dto.setSchStartDate(schedule.getSchStartDate());

        // 클래스 요약 정보 조회 (클래스명, 강사 닉네임, 썸네일)
        ClassSummaryDTO classInfo = oneDayRepository
                .findClassSummaryByClsNo(schedule.getClsNo())
                .orElseThrow(() -> new ReservationException(
                        "클래스 정보를 찾을 수 없습니다."
                ));

        // 예약 DTO에 클래스 정보 설정
        dto.setClassInfo(classInfo);

        return dto;
    }

    //예약 등록
    @Override
    @Transactional
    public ReservationDTO createReservation(ReservationDTO reservationDTO, Long memNo) {

        // 로그인한 회원 번호 설정
        reservationDTO.setMemNo(memNo);

        Long schNo = reservationDTO.getSchNo();
        Integer rsvCount = reservationDTO.getRsvCount();

        // 이미 확정된 예약이 있다면 중복 예약 차단
        boolean confirmedExists = reservationRepository
                .existsByMemNoAndSchNoAndRsvStatusIn(
                        memNo,
                        schNo,
                        List.of(ReservationStatus.CONFIRMED)
                );

        if (confirmedExists) {
            throw new ReservationException(
                    "이미 해당 일정에 확정된 예약이 있습니다."
            );
        }

        // 기존 미결제 예약 조회
        Reservation existingReservation = reservationRepository
                .findFirstByMemNoAndSchNoAndRsvStatusOrderByRsvCreatedAtDesc(
                        memNo,
                        schNo,
                        ReservationStatus.WAIT
                )
                .orElse(null);

        // 기존 미결제 예약이 있으면 인원과 금액 갱신
        if (existingReservation != null) {

            ReservationCountDTO countDTO =
                    countReservation(schNo, rsvCount);

            existingReservation.setRsvCount(rsvCount);
            existingReservation.setRsvAmount(countDTO.getRsvAmount());

            return reservationMapper.toDTO(existingReservation);
        }

        // 정원 확인 및 예약 금액 계산 + 일정 Lock
        ReservationCountDTO countDTO =
                countReservation(schNo, rsvCount);

        // 서버에서 계산한 금액 적용
        reservationDTO.setRsvAmount(countDTO.getRsvAmount());

        // Entity 변환 및 저장
        Reservation reservation = reservationMapper.toEntity(reservationDTO);
        Reservation savedReservation = reservationRepository.save(reservation);

        return reservationMapper.toDTO(savedReservation);
    }

    // 예약 상세 조회
    @Override
    @Transactional(readOnly = true)
    public ReservationDTO getReservation(Long rsvNo, Long memNo, String memRole) {
        Reservation reservation = reservationRepository.findById(rsvNo)
                .orElseThrow(() -> new ReservationException(
                        "예약 정보를 찾을 수 없습니다."
                ));

        // 회원은 본인 예약만 조회 가능
        boolean isOwner = reservation.getMemNo().equals(memNo);

        // 강사는 본인이 등록한 클래스의 예약 상세만 조회 가능
        boolean isClassInstructor = false;
        if ("INS".equals(memRole)) {
            Schedule schedule = scheduleRepository.findById(reservation.getSchNo())
                    .orElseThrow(() -> new ReservationException("일정 정보를 찾을 수 없습니다."));
            OneDay oneDay = oneDayRepository.findById(schedule.getClsNo())
                    .orElseThrow(() -> new ReservationException("클래스 정보를 찾을 수 없습니다."));
            isClassInstructor = oneDay.getMemNo().equals(memNo);
        }

        if (!isOwner && !isClassInstructor) {
            throw new ReservationException("해당 예약에 접근할 수 없습니다.");
        }

        return toReservationDTO(reservation);
    }

    // 로그인 회원의 예약 내역 조회
    @Override
    @Transactional(readOnly = true)
    public List<ReservationDTO> getReservationListByMember(Long memNo) {

        return reservationRepository
                .findAllByMemNoOrderByRsvCreatedAtDesc(memNo)
                .stream()
                .map(this::toReservationDTO)
                .toList();
    }

    // 로그인 강사가 등록한 클래스의 예약 목록
    @Override
    @Transactional(readOnly = true)
    public List<ReservationDTO> getReservationListByInstructor(Long memNo) {
        return reservationRepository
                .findAllByInstructorMemNoOrderByRsvCreatedAtDesc(memNo)
                .stream()
                .map(this::toReservationDTO)
                .toList();
    }

    // 로그인 강사가 등록한 특정 일정의 예약 목록
    @Override
    @Transactional(readOnly = true)
    public List<ReservationDTO> getReservationListByInstructorAndSchedule(Long memNo, Long schNo) {
        Schedule schedule = scheduleRepository.findById(schNo)
                .orElseThrow(() -> new ReservationException("일정 정보를 찾을 수 없습니다."));
        OneDay oneDay = oneDayRepository.findById(schedule.getClsNo())
                .orElseThrow(() -> new ReservationException("클래스 정보를 찾을 수 없습니다."));

        if (!oneDay.getMemNo().equals(memNo)) {
            throw new ReservationException("해당 일정의 예약을 조회할 권한이 없습니다.");
        }

        return reservationRepository
                .findAllByInstructorAndScheduleOrderByRsvCreatedAtDesc(memNo, schNo)
                .stream()
                .map(this::toReservationDTO)
                .toList();
    }

    // 예약 취소
    @Override
    @Transactional
    public void cancelReservation(Long rsvNo, String cancelReason, Long memNo) {

        Reservation reservation = reservationRepository.findById(rsvNo)
                .orElseThrow(() -> new ReservationException(
                        "예약 정보를 찾을 수 없습니다."
                ));

        if (!reservation.getMemNo().equals(memNo)) {
            throw new ReservationException("해당 예약을 취소할 권한이 없습니다.");
        }

        if (reservation.getRsvStatus() == ReservationStatus.CANCEL) {
            throw new ReservationException("이미 취소된 예약입니다.");
        }

        // 결제 취소
        paymentService.cancelPayment(rsvNo, memNo);

        // 예약 취소
        reservation.cancel(cancelReason);
    }

    // 여기부터 추가 (oneday가 일정 삭제 가능 여부/예약 인원 확인 시 reservation 내부 구현을 직접 참조하지 않도록 공개)
    private static final List<ReservationStatus> ACTIVE_RESERVATION_STATUSES = List.of(
            ReservationStatus.WAIT,
            ReservationStatus.CONFIRMED
    );

    // 일정에 활성(대기/확정) 예약이 있는지 확인
    @Override
    @Transactional(readOnly = true)
    public boolean hasActiveReservation(Long schNo) {
        return reservationRepository.existsBySchNoAndRsvStatusIn(schNo, ACTIVE_RESERVATION_STATUSES);
    }

    // 일정별 활성(대기/확정) 예약 인원 합계
    @Override
    @Transactional(readOnly = true)
    public int countActiveReservations(Long schNo) {
        return reservationRepository.sumRsvCountBySchNoAndRsvStatusIn(schNo, ACTIVE_RESERVATION_STATUSES);
    }
    // 여기까지 추가
    // 정원 및 예약 금액 계산
    @Override
    @Transactional
    public ReservationCountDTO countReservation(Long schNo, Integer rsvCount) {
        // 예약 인원 검증
        if (rsvCount == null || rsvCount < 1) {
            throw new ReservationException(
                    "예약 인원은 1명 이상이어야 합니다."
            );
        }

        // 일정 조회 + 행 Lock
        Schedule schedule = scheduleRepository.findByIdForUpdate(schNo)
                .orElseThrow(() ->
                        new ReservationException(
                                "해당 일정을 찾을 수 없습니다."
                        )
                );

        // 클래스 조회
        OneDay oneDay = oneDayRepository.findById(schedule.getClsNo())
                .orElseThrow(() ->
                        new ReservationException(
                                "해당 클래스를 찾을 수 없습니다."
                        )
                );

        // 현재 확정된 예약 인원
        Integer reservedCount = reservationRepository.sumConfirmedCount(
                        schNo, ReservationStatus.CONFIRMED
                );

        // 남은 정원
        Integer remainingCount = schedule.getSchCapacity() - reservedCount;

        // 정원 초과 확인
        if (rsvCount > remainingCount) {
            throw new ReservationException(
                    "예약 가능한 인원을 초과했습니다."
            );
        }

        // 1인 가격
        Integer clsPrice = oneDay.getClsPrice();

        // 최종 예약 금액
        Integer rsvAmount = clsPrice * rsvCount;

        return ReservationCountDTO.builder()
                .schNo(schNo)
                .capacity(schedule.getSchCapacity())
                .reservedCount(reservedCount)
                .remainingCount(remainingCount)
                .rsvCount(rsvCount)
                .clsPrice(clsPrice)
                .rsvAmount(rsvAmount)
                .build();
    }
}
