
package com.spring.classon.reservation.service;

import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.entity.ReservationStatus;
import com.spring.classon.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationCompletionService {

    private final ReservationRepository reservationRepository;

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
}
