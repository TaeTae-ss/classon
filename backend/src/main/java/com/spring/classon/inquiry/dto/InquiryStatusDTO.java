package com.spring.classon.inquiry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class InquiryStatusDTO {

    @NotBlank(message = "문의 처리 상태를 입력해주세요.")
    @Pattern(
            regexp = "접수|처리중|완료",
            message = "문의 상태는 접수, 처리중, 완료 중 하나여야 합니다."
    )
    private String inqStatus;
}