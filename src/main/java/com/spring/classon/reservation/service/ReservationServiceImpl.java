package com.spring.classon.reservation.service;

import com.spring.classon.common.exception.ReservationException;
import com.spring.classon.oneday.entity.OneDay;
import com.spring.classon.oneday.entity.Schedule;
import com.spring.classon.oneday.repository.OneDayRepository;
import com.spring.classon.oneday.repository.ScheduleRepository;
import com.spring.classon.payment.service.PaymentService;
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


    //예약 등록
    @Override
    @Transactional
    public ReservationDTO createReservation(ReservationDTO reservationDTO) {

        // 정원 및 금액 계산 + Schedule Lock
        ReservationCountDTO countDTO = countReservation(
                reservationDTO.getSchNo(), reservationDTO.getRsvCount()
        );

        // 중복 예약 검사
        List<ReservationStatus> activeStatuses = List.of(
                ReservationStatus.WAIT,
                ReservationStatus.CONFIRMED
        );

        boolean exists = reservationRepository
                .existsByMemNoAndSchNoAndRsvStatusIn(
                        reservationDTO.getMemNo(),
                        reservationDTO.getSchNo(),
                        activeStatuses
                );

        if (exists) {
            throw new ReservationException(
                    "이미 해당 일정에 예약한 회원입니다."
            );
        }

        // 서버에서 계산된 예약 금액 적용
        reservationDTO.setRsvAmount(countDTO.getRsvAmount());

        Reservation reservation = reservationMapper.toEntity(reservationDTO);
        Reservation savedReservation = reservationRepository.save(reservation);

        return reservationMapper.toDTO(savedReservation);
    }

    // 예약 상세 조회
    @Override
    @Transactional(readOnly = true)
    public ReservationDTO getReservation(Long rsvNo) {
        Reservation reservation = reservationRepository.findById(rsvNo)
                .orElseThrow(() -> new ReservationException(
                        "예약 정보를 찾을 수 없습니다."
                ));

        return reservationMapper.toDTO(reservation);
    }

    // 예약 목록 조회
    @Override
    @Transactional(readOnly = true)
    public List<ReservationDTO> getReservationList() {

        return reservationRepository.findAll()
                .stream()
                .map(reservationMapper::toDTO)
                .toList();
    }

    // 회원 예약 내역 조회
    @Override
    @Transactional(readOnly = true)
    public List<ReservationDTO> getReservationListByMember(Long memNo) {

        return reservationRepository
                .findAllByMemNoOrderByRsvCreatedAtDesc(memNo)
                .stream()
                .map(reservationMapper::toDTO)
                .toList();
    }

    // 예약 취소
    @Override
    @Transactional
    public void cancelReservation(Long rsvNo, String cancelReason) {

        Reservation reservation = reservationRepository.findById(rsvNo)
                .orElseThrow(() -> new ReservationException(
                        "예약 정보를 찾을 수 없습니다."
                ));

        if (reservation.getRsvStatus() == ReservationStatus.CANCEL) {
            throw new ReservationException("이미 취소된 예약입니다.");
        }

        // 결제 취소
        paymentService.cancelPayment(rsvNo);

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
