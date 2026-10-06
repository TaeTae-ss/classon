package com.spring.classon.inquiry.dto;

import jakarta.validation.constraints.Size;
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

    @Size(
            min = 1,
            max = 100,
            message = "문의 제목은 1자 이상 100자 이하로 입력해주세요."
    )
    private String inqTitle;

    @Size(
            min = 1,
            max = 255,
            message = "문의 내용은 1자 이상 255자 이하로 입력해주세요."
    )
    private String inqContent;

    @Size(
            max = 255,
            message = "관리자 답변은 255자 이하로 입력해주세요."
    )
    private String admComment;

    private LocalDateTime proCreatedAt;
}