
package com.spring.classon.reservation.service;

import com.spring.classon.oneday.entity.Schedule;
import com.spring.classon.oneday.repository.ScheduleRepository;
import com.spring.classon.payment.entity.Payment;
import com.spring.classon.payment.entity.PaymentStatus;
import com.spring.classon.payment.repository.PaymentRepository;
import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.entity.ReservationStatus;
import com.spring.classon.reservation.repository.ReservationRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationMaintenanceService {

    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final ScheduleRepository scheduleRepository;
    private final EntityManager entityManager;

    // 예약 수강 완료 처리
    @Transactional
    public void completeReservations() {

        LocalDate today = LocalDate.now(
                ZoneId.of("Asia/Seoul")
        );

        // 수강 날짜가 지난 확정 예약 조회
        List<Reservation> reservations =
                reservationRepository.findReservationsToComplete(
                        today,
                        ReservationStatus.CONFIRMED
                );

        // 예약 상태를 수강 완료로 변경
        for (Reservation reservation : reservations) {
            reservation.complete();
        }

        log.info("수강 완료 처리 건수: {}", reservations.size());
    }

    // 11분이 지난 미결제 예약 만료 처리
    @Transactional
    public void expireWaitingReservations() {

        LocalDateTime expirationTime =
                LocalDateTime.now(ZoneId.of("Asia/Seoul"))
                        .minusMinutes(11);

        List<Reservation> reservations =
                reservationRepository.findExpiredWaitingReservations(
                        ReservationStatus.WAIT,
                        expirationTime
                );

        int expiredCount = 0;

        for (Reservation reservation : reservations) {

            // 결제 승인과 같은 일정 Lock을 사용
            Schedule schedule = scheduleRepository
                    .findByIdForUpdate(reservation.getSchNo())
                    .orElse(null);

            if (schedule == null) {
                continue;
            }

            // Lock을 기다리는 동안 예약 상태가 바뀌었는지 확인
            try {
                entityManager.refresh(reservation);
            } catch (jakarta.persistence.EntityNotFoundException e) {
                // 다른 작업에서 이미 삭제된 예약
                continue;
            }

            if (reservation.getRsvStatus() != ReservationStatus.WAIT) {
                continue;
            }

            if (reservation.getRsvCreatedAt().isAfter(expirationTime)) {
                continue;
            }

            List<Payment> payments =
                    paymentRepository
                            .findAllByReservationOrderByPayCreatedAtDesc(
                                    reservation
                            );

            // 결제 완료 기록이 있으면 삭제하지 않음
            boolean paid = payments.stream()
                    .anyMatch(payment ->
                            payment.getPayStatus() == PaymentStatus.PAID
                    );

            if (paid) {
                log.warn(
                        "결제 완료 기록이 있어 만료 처리를 건너뜁니다. rsvNo={}",
                        reservation.getRsvNo()
                );
                continue;
            }

            // FK 제약 조건 때문에 결제 내역부터 삭제
            paymentRepository.deleteAll(payments);

            // 미결제 예약 삭제
            reservationRepository.delete(reservation);

            expiredCount++;
        }

        log.info("미결제 예약 만료 처리 건수: {}", expiredCount);
    }
}
