package com.spring.classon.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassSummaryDTO {

    private Long clsNo;
    private String clsName;
    private String instructorName;
    private String clsImgThumb;
}
