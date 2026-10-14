
package com.spring.classon.reservation.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReservationCompletionScheduler {

    private final ReservationCompletionService
            reservationCompletionService;

    // 서버 시작 완료 후 미처리 예약 확인
    @EventListener(ApplicationReadyEvent.class)
    public void completeReservationsOnStartup() {

        log.info("서버 시작 후 수강 완료 대상 예약 확인");

        reservationCompletionService.completeReservations();
    }

    // 매일 한국 시간 00:00에 실행
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void completeReservations() {

        reservationCompletionService.completeReservations();
    }
}
