package com.spring.classon.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ReservationCountDTO {
    // 일정 번호
    private Long schNo;

    // 해당 일정의 최대 정원
    private Integer capacity;

    // 현재 예약된 인원
    private Integer reservedCount;

    // 남은 정원
    private Integer remainingCount;

    // 예약하려는 인원
    private Integer rsvCount;

    // 클래스 1인 가격
    private Integer clsPrice;

    // 최종 예약 금액
    private Integer rsvAmount;
}
