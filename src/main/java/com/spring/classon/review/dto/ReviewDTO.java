package com.spring.classon.review.dto;

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
    private Integer revRating;
    private String revContent;
    private LocalDateTime revCreatedAt;
    private String revStatus;
}
