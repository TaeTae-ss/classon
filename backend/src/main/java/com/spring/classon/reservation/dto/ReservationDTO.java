package com.spring.classon.reservation.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.spring.classon.reservation.entity.ReservationStatus;
import lombok.*;

import java.time.LocalDate;
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

    private LocalDate schStartDate;

    private Integer rsvCount;

    private Integer rsvAmount;

    private String rsvCancelReason;

    private ReservationStatus rsvStatus;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime rsvCreatedAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime rsvConfirmedAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime rsvCanceledAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime rsvCompletedAt;

    private ClassSummaryDTO classInfo;
}