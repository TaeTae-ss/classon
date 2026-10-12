package com.spring.classon.reservation.service;

import com.spring.classon.reservation.dto.ReservationCountDTO;
import com.spring.classon.reservation.dto.ReservationDTO;

import java.util.List;

public interface ReservationService {

    // 예약 생성
    ReservationDTO createReservation(ReservationDTO reservationDTO, Long memNo);

    // 예약 단건 조회
    ReservationDTO getReservation(Long rsvNo, Long memNo, String memRole);

    // 예약 목록 조회
    List<ReservationDTO> getReservationListByMember(Long memNo);

    // 예약 취소
    void cancelReservation(Long rsvNo, String cancelReason, Long memNo);

    // (oneday가 일정 삭제 가능 여부/예약 인원 확인 시 reservation 내부 구현을 직접 참조하지 않도록 공개)
    // 일정에 활성(대기/확정) 예약이 있는지 확인
    boolean hasActiveReservation(Long schNo);

    // 일정별 활성(대기/확정) 예약 인원 합계
    int countActiveReservations(Long schNo);

    // 정원 및 예약 금액 계산
    ReservationCountDTO countReservation(Long schNo, Integer rsvCount);

    // 로그인 강사가 등록한 클래스의 예약 목록
    List<ReservationDTO> getReservationListByInstructor(Long memNo);

    // 로그인 강사가 등록한 특정 일정의 예약 목록
    List<ReservationDTO> getReservationListByInstructorAndSchedule(
            Long memNo,
            Long schNo
    );
}
