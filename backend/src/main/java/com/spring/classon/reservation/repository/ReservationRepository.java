package com.spring.classon.reservation.repository;

import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.entity.ReservationStatus;
import com.spring.classon.oneday.entity.Schedule;
import com.spring.classon.oneday.entity.OneDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // 중복 예약 검사
    boolean existsByMemNoAndSchNoAndRsvStatusIn(
            Long memNo,
            Long schNo,
            List<ReservationStatus> status
    );

    // 회원 예약 내역 조회
    List<Reservation> findAllByMemNoOrderByRsvCreatedAtDesc(Long memNo);

    // 로그인 강사가 등록한 클래스들의 예약 목록
    @Query("""
        SELECT r
        FROM Reservation r, Schedule s, OneDay c
        WHERE r.schNo = s.schNo
          AND s.clsNo = c.clsNo
          AND c.memNo = :memNo
        ORDER BY r.rsvCreatedAt DESC
    """)
    List<Reservation> findAllByInstructorMemNoOrderByRsvCreatedAtDesc(
            @Param("memNo") Long memNo
    );

    // 로그인 강사가 소유한 특정 일정의 예약 목록
    @Query("""
        SELECT r
        FROM Reservation r, Schedule s, OneDay c
        WHERE r.schNo = s.schNo
          AND s.clsNo = c.clsNo
          AND c.memNo = :memNo
          AND s.schNo = :schNo
        ORDER BY r.rsvCreatedAt DESC
    """)
    List<Reservation> findAllByInstructorAndScheduleOrderByRsvCreatedAtDesc(
            @Param("memNo") Long memNo,
            @Param("schNo") Long schNo
    );

    // 일정 삭제 가능 여부 확인 (대기/확정 예약 존재 여부)
    boolean existsBySchNoAndRsvStatusIn(Long schNo, List<ReservationStatus> status);

    // 일정별 예약 인원 합계 (대기/확정 예약만 집계)
    @Query("select coalesce(sum(r.rsvCount), 0) from Reservation r " +
            "where r.schNo = :schNo and r.rsvStatus in :status")
    int sumRsvCountBySchNoAndRsvStatusIn(
            @Param("schNo") Long schNo,
            @Param("status") List<ReservationStatus> status);

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

    // 회원의 특정 일정에 대한 결제 대기 예약 조회
    Optional<Reservation> findFirstByMemNoAndSchNoAndRsvStatusOrderByRsvCreatedAtDesc(
            Long memNo,
            Long schNo,
            ReservationStatus rsvStatus
    );

    // 수강일이 오늘보다 이전인 확정 예약 조회
    // 날짜 조건으로 조회하므로 서버 중단 중 놓친 예약도 다음 실행 때 처리 가능
    @Query("""
        SELECT r
        FROM Reservation r, Schedule s
        WHERE r.schNo = s.schNo
          AND r.rsvStatus = :status
          AND s.schStartDate < :today
    """)
    List<Reservation> findConfirmedReservationsBeforeDate(
            @Param("status") ReservationStatus status,
            @Param("today") LocalDate today
    );
}
