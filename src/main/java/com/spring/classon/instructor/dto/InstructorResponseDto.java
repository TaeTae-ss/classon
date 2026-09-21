package com.spring.classon.instructor.dto;

import lombok.*;

@Getter
@Builder
@AllArgsConstructor
public class InstructorResponseDto {

    private Long reqNo;
    private Long memNo;
    private String reqIntroduction;
    private String reqCareer;
    private String reqStatus;
}