package com.spring.classon.reservation.service;

import com.spring.classon.reservation.dto.ReservationCountDTO;
import com.spring.classon.reservation.dto.ReservationDTO;

import java.util.List;

public interface ReservationService {

    // 예약 생성
    ReservationDTO createReservation(ReservationDTO reservationDTO);

    // 예약 단건 조회
    ReservationDTO getReservation(Long rsvNo);

    // 예약 목록 조회
    List<ReservationDTO> getReservationList();

    // 회원 예약 목록 조회
    List<ReservationDTO> getReservationListByMember(Long memNo);

    // 예약 취소
    void cancelReservation(Long rsvNo, String cancelReason);

    // 정원 및 예약 금액 계산
    ReservationCountDTO countReservation(Long schNo, Integer rsvCount);
}
