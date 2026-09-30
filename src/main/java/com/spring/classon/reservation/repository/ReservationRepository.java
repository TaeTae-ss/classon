package com.spring.classon.reservation.repository;

import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    // 해당 일정의 현재 예약 인원
    // CONFIRMED 상태의 예약만 정원에 포함
    @Query("""
        SELECT COALESCE(SUM(r.rsvCount), 0)
        FROM Reservation r
        WHERE r.schNo = :schNo
          AND r.rsvStatus = :status
    """)
    Integer sumConfirmedCount(
            @Param("schNo") Long schNo,
            @Param("status") ReservationStatus status
    );
}
