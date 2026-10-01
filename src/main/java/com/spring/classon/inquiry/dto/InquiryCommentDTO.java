package com.spring.classon.inquiry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class InquiryCommentDTO {

    @NotBlank(message = "관리자 답변을 입력해주세요.")
    @Size(
            max = 255,
            message = "관리자 답변은 255자 이하로 입력해주세요."
    )
    private String admComment;
}