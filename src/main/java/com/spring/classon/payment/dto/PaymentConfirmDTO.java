package com.spring.classon.payment.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PaymentConfirmDTO {
    private String payKey;

    private String orderNo;

    private Integer payAmount;

    public PaymentConfirmDTO(
            String payKey,
            String orderNo,
            Integer payAmount
    ) {
        this.payKey = payKey;
        this.orderNo = orderNo;
        this.payAmount = payAmount;
    }
}
