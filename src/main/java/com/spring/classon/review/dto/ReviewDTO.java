package com.spring.classon.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {
    private Long revNo;
    private Long rsvNo;
    private Long clsNo;

    @NotNull //API 요청을 받는 단계에서 먼저 검사
    @Min(1)
    @Max(5) //허용 범위를 1~5로 제한
    private Integer revRating;

    private String revContent;
    private LocalDateTime revCreatedAt;
    private String revStatus;
}
