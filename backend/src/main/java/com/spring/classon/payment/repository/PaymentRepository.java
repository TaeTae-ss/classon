package com.spring.classon.payment.repository;

import com.spring.classon.payment.entity.Payment;
import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {


    List<Payment> findAllByReservationOrderByPayCreatedAtDesc(
            Reservation reservation
    );

    // 가장 최근 결제 시도
    Optional<Payment> findTopByReservationOrderByPayCreatedAtDesc(
            Reservation reservation
    );

    Optional<Payment> findByOrderNo(String orderNo);

    Optional<Payment> findByPayKey(String payKey);

    boolean existsByReservation(Reservation reservation);

    // 예약 인원 합계
    @Query("""
    SELECT COALESCE(SUM(r.rsvCount), 0)
    FROM Reservation r
    WHERE r.schNo = :schNo
      AND r.rsvStatus IN :statuses
""")
    Integer sumRsvCountBySchNoAndStatusIn(
            @Param("schNo") Long schNo,
            @Param("statuses") List<ReservationStatus> statuses
    );
}

