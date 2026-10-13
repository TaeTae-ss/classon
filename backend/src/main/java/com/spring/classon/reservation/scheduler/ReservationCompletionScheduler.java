package com.spring.classon.reservation.scheduler;

import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.entity.ReservationStatus;
import com.spring.classon.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ReservationCompletionScheduler {

    private static final ZoneId KOREA_ZONE = ZoneId.of("Asia/Seoul");

    private final ReservationRepository reservationRepository;

    // 매일 한국 시간 자정에 수강일이 지난 확정 예약을 완료 처리한다.
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    @Transactional
    public void completeExpiredReservations() {
        LocalDate today = LocalDate.now(KOREA_ZONE);

        List<Reservation> reservations =
                reservationRepository.findConfirmedReservationsBeforeDate(
                        ReservationStatus.CONFIRMED,
                        today
                );

        reservations.forEach(Reservation::complete);
    }
}
