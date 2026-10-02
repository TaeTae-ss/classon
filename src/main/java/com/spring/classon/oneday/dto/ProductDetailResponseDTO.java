package com.spring.classon.oneday.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponseDTO {

    private Long clsNo;

    private String clsName;

    private String catName;

    private String instructorName;

    private Integer maxCapacity;

    private Double rating;

    private Integer clsPrice;

    private String clsDesc;

    private String clsRoadAddr;

    private String clsDetailAddr;
}
