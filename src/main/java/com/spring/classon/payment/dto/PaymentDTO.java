package com.spring.classon.payment.dto;

import com.spring.classon.payment.entity.Payment;
import com.spring.classon.payment.entity.PaymentStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {

    private Long payNo;
    private Long rsvNo;
    private String orderNo;
    private String payMethod;
    private Integer payAmount;
    private PaymentStatus payStatus;
    private String payKey;
    private LocalDateTime payCreatedAt;
    private LocalDateTime payPaidAt;
    private LocalDateTime payCanceledAt;

    public PaymentDTO(Payment payment) {
        this.payNo = payment.getPayNo();
        this.rsvNo = payment.getReservation().getRsvNo();
        this.orderNo = payment.getOrderNo();
        this.payMethod = payment.getPayMethod();
        this.payAmount = payment.getPayAmount();
        this.payStatus = payment.getPayStatus();
        this.payKey = payment.getPayKey();
        this.payCreatedAt = payment.getPayCreatedAt();
        this.payPaidAt = payment.getPayPaidAt();
        this.payCanceledAt = payment.getPayCanceledAt();
    }
}
