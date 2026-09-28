package com.spring.classon.inquiry.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class InquiryDTO {

    private Long inqNo;

    private Long inqMemNo;

    private String inqStatus;

    private LocalDateTime inqCreatedAt;

    private String inqTitle;

    private String inqContent;

    private String admComment;

    private LocalDateTime proCreatedAt;
}