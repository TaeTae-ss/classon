package com.spring.classon.reservation.repository;

import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // 중복 예약 검사
    boolean existsByMemNoAndSchNoAndRsvStatusIn(
            Long memNo,
            Long schNo,
            List<ReservationStatus> status
    );

    // 회원 예약 내역 조회
    List<Reservation> findAllByMemNoOrderByRsvCreatedAtDesc(Long memNo);
}
