package com.spring.classon.favorite.dto;

import com.spring.classon.oneday.dto.ProductResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteDTO {
    private Long favNo;
    private Long memNo;
    private Long clsNo;

    private ProductResponseDTO product;

    private Integer clsDuration;
    private String clsRoadAddr;
    private String clsDetailAddr;
    private Integer maxCapacity;


}
