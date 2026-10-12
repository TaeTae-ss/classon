package com.spring.classon.instructor.dto;

import lombok.*;

@Getter
@Builder
@AllArgsConstructor
public class InstructorResponseDTO {

    private Long reqNo;
    private Long memNo;
    private String reqIntroduction;
    private String reqCareer;
    private String reqStatus;
    private String memNickname;
    private String memEmail;
    private String rejReason; // 반려 사유
}