package com.spring.classon.reservation.service;

import com.spring.classon.payment.service.PaymentService;
import com.spring.classon.reservation.dto.ReservationDTO;
import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.entity.ReservationStatus;
import com.spring.classon.reservation.mapper.ReservationMapper;
import com.spring.classon.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationServiceImpl implements ReservationService{
    private final ReservationRepository reservationRepository;
    private final ReservationMapper reservationMapper;
    private final PaymentService paymentService;

    //예약 등록
    @Override
    @Transactional
    public ReservationDTO createReservation(ReservationDTO reservationDTO) {
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
            throw new IllegalStateException(
                    "이미 해당 일정에 예약한 회원입니다."
            );
        }

        Reservation reservation = reservationMapper.toEntity(reservationDTO);
        Reservation savedReservation = reservationRepository.save(reservation);

        return reservationMapper.toDTO(savedReservation);
    }

    // 예약 상세 조회
    @Override
    @Transactional(readOnly = true)
    public ReservationDTO getReservation(Long rsvNo) {
        Reservation reservation = reservationRepository.findById(rsvNo)
                .orElseThrow(() -> new IllegalArgumentException(
                        "예약 정보를 찾을 수 없습니다. 예약 번호: " + rsvNo
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
                .orElseThrow(() -> new IllegalArgumentException(
                        "예약 정보를 찾을 수 없습니다. 예약 번호: " + rsvNo
                ));

        if (reservation.getRsvStatus() == ReservationStatus.CANCEL) {
            throw new IllegalStateException("이미 취소된 예약입니다.");
        }

        reservation.cancel(cancelReason);
    }

}
