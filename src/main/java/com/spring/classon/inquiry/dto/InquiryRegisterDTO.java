package com.spring.classon.inquiry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class InquiryRegisterDTO {

    // TODO: JWT 연동 후 제거
    private Long inqMemNo;

    @NotBlank(message = "문의 제목을 입력해주세요.")
    @Size(
            max = 100,
            message = "문의 제목은 100자 이하로 입력해주세요."
    )
    private String inqTitle;

    @NotBlank(message = "문의 내용을 입력해주세요.")
    @Size(
            max = 255,
            message = "문의 내용은 255자 이하로 입력해주세요."
    )
    private String inqContent;
}