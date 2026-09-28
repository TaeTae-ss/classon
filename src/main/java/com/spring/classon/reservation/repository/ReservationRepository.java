package com.spring.classon.reservation.repository;

import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    boolean existsByMemNoAndSchNoAndRsvStatusIn(
            Long memNo,
            Long schNo,
            List<ReservationStatus> status
    );
}
