package com.spring.classon.reservation.service;

import com.spring.classon.reservation.dto.ReservationDTO;
import com.spring.classon.reservation.entity.Reservation;
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

    //예약 등록
    @Override
    public ReservationDTO createReservation(ReservationDTO reservationDTO) {
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

    // 예약 취소
    @Override
    public void cancelReservation(Long rsvNo, String cancelReason) {

        Reservation reservation = reservationRepository.findById(rsvNo)
                .orElseThrow(() -> new IllegalArgumentException(
                        "예약 정보를 찾을 수 없습니다. 예약 번호: " + rsvNo
                ));

        reservation.cancel(cancelReason);
    }

}
