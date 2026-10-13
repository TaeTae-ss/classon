package com.spring.classon.reservation.service;

import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.entity.ReservationStatus;
import com.spring.classon.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReservationCompletionScheduler {

    private final ReservationRepository reservationRepository;

    // 매일 한국 시간 00:00에 수강 완료 처리
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    @Transactional
    public void completeReservations() {

        LocalDate today = LocalDate.now(
                java.time.ZoneId.of("Asia/Seoul")
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
}