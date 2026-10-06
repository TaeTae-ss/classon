package com.spring.classon.instructor.dto;

import lombok.*;

@Getter
@Builder
@AllArgsConstructor
public class InstructorDocumentResponseDTO {

    private Long docNo;
    private Long reqNo;
    private String docName;
    private String docUrl;
}