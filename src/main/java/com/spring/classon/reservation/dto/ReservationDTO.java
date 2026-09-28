package com.spring.classon.reservation.dto;

import com.spring.classon.reservation.entity.Reservation.ReservationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationDTO {

    private Long rsvNo;

    private Long memNo;

    private Long schNo;

    private Integer rsvCount;

    private Integer rsvAmount;

    private String rsvCancelReason;

    private ReservationStatus rsvStatus;

    private LocalDateTime rsvCreatedAt;

    private LocalDateTime rsvConfirmedAt;

    private LocalDateTime rsvCanceledAt;

    private LocalDateTime rsvCompletedAt;
}