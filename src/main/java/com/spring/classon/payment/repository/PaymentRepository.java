package com.spring.classon.payment.repository;

import com.spring.classon.payment.entity.Payment;
import com.spring.classon.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByReservation(Reservation reservation);

    Optional<Payment> findByOrderNo(String orderNo);

    Optional<Payment> findByPayKey(String payKey);

    boolean existsByReservation(Reservation reservation);
}

