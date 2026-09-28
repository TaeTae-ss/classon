package com.spring.classon.reservation.service;

import com.spring.classon.reservation.dto.ReservationDTO;

import java.util.List;

public interface ReservationService {

    // 예약 생성
    ReservationDTO createReservation(ReservationDTO reservationDTO);

    // 예약 단건 조회
    ReservationDTO getReservation(Long rsvNo);

    // 예약 목록 조회
    List<ReservationDTO> getReservationList();

    // 예약 취소
    void cancelReservation(Long rsvNo, String cancelReason);
}
