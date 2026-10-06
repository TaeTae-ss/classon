package com.spring.classon.inquiry.dto;

import com.spring.classon.common.dto.PageRequestDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class InquiryPageRequestDTO extends PageRequestDTO {

    private String status = "";
}
