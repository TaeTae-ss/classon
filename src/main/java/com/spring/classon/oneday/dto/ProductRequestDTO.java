package com.spring.classon.oneday.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequestDTO {

    private Long catNo;

    private String clsName;

    private String clsDesc;

    private Integer clsPrice;

    private String clsRoadAddr;

    private String clsDetailAddr;

    private String clsLevel;

    private Integer clsDuration;
}
