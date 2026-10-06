package com.spring.classon.oneday.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResponseDTO {

    private Long schNo;

    private Long clsNo;

    private LocalDate schStartDate;

    private Integer schCapacity;

    private Integer reservedCount;

    private Integer remainingCapacity;
}
