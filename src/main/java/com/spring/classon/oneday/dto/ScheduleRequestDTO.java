package com.spring.classon.oneday.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRequestDTO {

    private LocalDate schStartDate;

    private Integer schCapacity;
}
