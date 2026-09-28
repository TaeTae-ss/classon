package com.spring.classon.payment.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PaymentCreateDTO {
    private Long rsvNo;

    public PaymentCreateDTO(Long rsvNo) {
        this.rsvNo = rsvNo;
    }
}
