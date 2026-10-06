package com.spring.classon.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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

    @NotNull // 예약번호 반드시 필요
    private Long rsvNo;
    private Long clsNo;

    @NotNull //API 요청을 받는 단계에서 먼저 검사
    @Min(1)
    @Max(5) //허용 범위를 1~5로 제한
    private Integer revRating;

    @NotBlank //내용 반드시 필요 + 빈 문자열/공백 불가
    private String revContent;

    private LocalDateTime revCreatedAt;
    private String revStatus;
}
