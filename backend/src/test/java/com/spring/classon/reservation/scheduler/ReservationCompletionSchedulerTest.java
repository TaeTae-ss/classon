package com.spring.classon.reservation.scheduler;

import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.entity.ReservationStatus;
import com.spring.classon.reservation.repository.ReservationRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ReservationCompletionSchedulerTest {

    private static final ZoneId KOREA_ZONE = ZoneId.of("Asia/Seoul");

    @Test
    void completesConfirmedReservationsBeforeToday() {
        ReservationRepository repository = mock(ReservationRepository.class);
        ReservationCompletionScheduler scheduler =
                new ReservationCompletionScheduler(repository);

        Reservation reservation = new Reservation();
        reservation.setRsvStatus(ReservationStatus.CONFIRMED);

        LocalDate today = LocalDate.now(KOREA_ZONE);
        when(repository.findConfirmedReservationsBeforeDate(
                ReservationStatus.CONFIRMED, today
        )).thenReturn(List.of(reservation));

        scheduler.completeExpiredReservations();

        assertEquals(ReservationStatus.COMPLETED, reservation.getRsvStatus());
        assertNotNull(reservation.getRsvCompletedAt());
        verify(repository).findConfirmedReservationsBeforeDate(
                ReservationStatus.CONFIRMED, today
        );
    }

    @Test
    void doesNotChangeReservationsWhenNoExpiredConfirmedReservationsExist() {
        ReservationRepository repository = mock(ReservationRepository.class);
        ReservationCompletionScheduler scheduler =
                new ReservationCompletionScheduler(repository);

        when(repository.findConfirmedReservationsBeforeDate(
                ReservationStatus.CONFIRMED, LocalDate.now(KOREA_ZONE)
        )).thenReturn(List.of());

        scheduler.completeExpiredReservations();

        verify(repository).findConfirmedReservationsBeforeDate(
                ReservationStatus.CONFIRMED, LocalDate.now(KOREA_ZONE)
        );
    }
}
