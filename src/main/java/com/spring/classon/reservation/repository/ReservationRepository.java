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

    // 일정 삭제 가능 여부 확인 (대기/확정 예약 존재 여부)
    boolean existsBySchNoAndRsvStatusIn(Long schNo, List<ReservationStatus> status);

    // 일정별 예약 인원 합계 (대기/확정 예약만 집계)
    @Query("select coalesce(sum(r.rsvCount), 0) from Reservation r " +
            "where r.schNo = :schNo and r.rsvStatus in :status")
    int sumRsvCountBySchNoAndRsvStatusIn(
            @Param("schNo") Long schNo,
            @Param("status") List<ReservationStatus> status
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
