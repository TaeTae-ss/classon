package com.spring.classon.oneday.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProductResponseDTO {

    private Long clsNo;

    private String clsName;

    private String instructorName;

    private String clsLevel;

    private String clsImgThumb;

    private Double rating;
}
